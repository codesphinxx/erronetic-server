var shortid     = require('shortid');
var config      = require('./config');
var App         = require('./models/app');
var Log         = require('./models/log');
var utils       = require('./utils');
var ipCountry   = require('ip-country');

ipCountry.init({
    mmdb: './data/geolite.mmdb',
    fallbackCountry: 'US',
    exposeInfo: false
});

module.exports.create_app = function(req, res) {
    var user_id = String(req.body.user_id);
    var app_name = String (req.body.app_name);
    var app_id = shortid.generate();
    App.create({id:app_id,name:app_name,createdby:user_id}, function(err){
        if (!err)
        {
            res.json({success: true, id:app_id});
        }
        else
        {
            res.status(500).json({success:false, message:config.ERROR_MSG.CREATE_APP});
        }
    });
};

module.exports.encrypt = function(req, res) {
    var app_id = String(req.body.app_id);
    var project_id = String(req.body.project_id);
    var app_name = String (req.body.app_name);
    var token = utils.createToken(app_name, app_id, project_id);
    res.json({success: true, API_KEY:token});
};

module.exports.decrypt = function(req, res) {
    var api_key = String(req.body.api_key);
    var result = utils.decrypt_data(api_key);
    res.json({success: true, result:result});
};

module.exports.log = function(req, res) {
    var app_id = utils.strip(req.body); 
    
    if (app_id)
    {
        var info = ipCountry.lookup(req.clientIp);
        var log = new Log(); 
        log.app = app_id;
        log.ip = req.clientIp;
        log.data = JSON.copy(req.body);
        if (info && info.country)
        {
            log.country = info.country.names.en;
            log.country_code = info.country.iso_code;
        }       

        log.save(function(err){
            if (!err) res.json({success:true});
            else res.status(500).json({success:false, message:config.ERROR_MSG.GENERIC_ERROR});
        });
    }
    else
    {
        res.status(401).json({success:false, message:config.ERROR_MSG.INVALID_ID});
    }
};

module.exports.ipinfo = function(req, res) {
    var app_id = utils.strip(req.query);      

    if (app_id)
    {        
        var data = {success:false, message:'', ip:req.clientIp, countryCode:'', countryName:''};
        var info = ipCountry.lookup(req.clientIp);
        if (info && info.country)
        {
            data.countryName = info.country.names.en;
            data.countryCode = info.country.iso_code;
            data.success = true;
            res.json(data);
        }
        else
        {
            res.status(500).json({success:false, message:config.ERROR_MSG.COUNTRY_NOT_FOUND});
        } 
    }
    else
    {
        res.status(401).json({success:false, message:config.ERROR_MSG.INVALID_ID});
    }
};
