var cors        = require('cors');
var config      = require('./config');
var express     = require('express');
var controller  = require('./controller');

var router = express.Router();

router.put('/createapp', controller.create_app);
router.put('/encrypt', controller.encrypt);
router.put('/decrypt', controller.decrypt);

router.options('/log', cors(config.CORS_OPTIONS));
router.post('/log', cors(config.CORS_OPTIONS), controller.log);
router.get('/ipinfo', cors(config.CORS_OPTIONS), controller.ipinfo);

module.exports = router;