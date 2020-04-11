const WORKERS = process.env.WEB_CONCURRENCY || 1;
const PORT = process.env.PORT || 3000;
const REDIS_URL = process.env.REDIS_URL;
const MONGODB_URI = process.env.MONGODB_URI;

const log4js = require('log4js');
log4js.configure({
  appenders: { system: { type: 'file', filename: './logs/system.log' } },
  categories: { default: { appenders: ['system'], level: 'all' } }
});
const logger = log4js.getLogger('system');

require('sticky-cluster')(
  
  function (callback) {
    var express     = require('express');   
    var app         = express();  
    var path        = require('path'); 
    var bodyParser  = require('body-parser');
    var server      = require('http').createServer(app);
    var mongoose    = require('mongoose');
    var client      = require('redis').createClient(REDIS_URL);
    var limiter     = require('express-limiter')(app, client);
    var requestip   = require('request-ip');

    process.on('unhandledRejection', error => {
      logger.error('caught rejection:', error);
    });    
          
    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected!');
    });
    
    mongoose.connection.on('error', (error) => {
      logger.error('mongo-error:', error);
    });
    
    mongoose.connection.once('open', function() {
      logger.log('MongoDB connected!');
    });
        
    mongoose.connect(MONGODB_URI, {useNewUrlParser:true});
    var mongodb = mongoose.connection;

    app.use(bodyParser.urlencoded({ extended: false }));    
    app.use(bodyParser.json());
    
    app.use(requestip.mw());

    limiter({
      path: '/log',
      method: 'all',
      total: 20,
      expire: 1000 * 60,
      lookup: ['body.client', 'body.secret', 'connection.remoteAddress'],
      onRateLimited: function (req, res, next) {
        res.status(429).json({success: false, message: 'Request quota exceeded'});
      }
    });

    app.set('basepath',__dirname + '/public');
    app.use(express.static(path.join(__dirname, 'public')));

    var webRoutes = require('./web.routes');
    app.use('/', webRoutes); 
    
    callback(server);    
  },
  {
    concurrency: WORKERS,
    port: PORT,
    debug: false,
    env: function (index) { return { stickycluster_worker_index: index }; }
  }
);