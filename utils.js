var crypto  = require('crypto');
const logger = require('log4js').getLogger('system');
var utils   = module.exports;

const ENCRYPTION_KEY = process.env.APP_GEN_SECRET || 'g57632e428eb4c85';

utils.encrypt_data = function(text) {
    var result = '';
    try
    {
        var iv = Buffer.from([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);
        var cipher = crypto.createCipheriv('aes-128-cbc', Buffer.from(ENCRYPTION_KEY), iv);
        result = cipher.update(text,'utf8','hex')
        result += cipher.final('hex');
    }
    catch(error)
    {
        logger.error(error);
    }
    
    return result;
};
   
utils.decrypt_data = function(text) {
    var result = '';
    try
    {
        var iv = Buffer.from([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);
        var decipher = crypto.createDecipheriv('aes-128-cbc', Buffer.from(ENCRYPTION_KEY), iv);
        var decrypted = decipher.update(text,'hex','utf8')
        decrypted += decipher.final('utf8');
        result = decrypted;
    }
    catch(error)
    {
        logger.error(error);
    }
    return result;
};

utils.strip = function(query)
{
    var output = utils.decrypt_data(query.secret);
    var entries = output.split('|');
    delete query.secret;
   
    if (entries.length > 1)
        return entries[0];
    else
        return null;
};

utils.createToken = function(app_name, app_id, project_id)
{
    var encrypted = utils.encrypt_data(app_id+'|'+app_name+'|'+project_id);
    return encrypted;
}

utils.mergeObjetcs = function(target, modifier) 
{
    for (var i in modifier) 
    {
        try 
        {
            target[i] = modifier[i].constructor==Object ? mergeObjetcs(target[i], modifier[i]) : modifier[i];
        } 
        catch(e) 
        {
            target[i] = modifier[i];
        }
    }
    return target;
};

Object.defineProperty(JSON, 'copy', {
    value: function(object) 
    {
        return JSON.parse(JSON.stringify(object));
    }
});

String.random = function(length)
{
    length = length || Math.next(32);
    var charset = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var str = '';

    var max = charset.length - 1;
    for (var i = 0; i < length; i++)
    {
        str += charset[Math.next(max)];
    }
    return str;
};

Object.assign(Math, {
  next(max)
  {
      max = max || 32767;
      return Math.round(Math.random() * (max - 1));
  }
});

Object.assign(Math, {
  clamp (value, min, max) 
  {
    return Math.max(min, Math.min(max, value));
  }
});

Object.assign(Math, {
  next(max)
  {
      max = max || 32767;
      return Math.round(Math.random() * (max - 1));
  }
});

String.isNullOrEmpty = function (str) {
  if (str === null || str === undefined)
      return true;

  var text = str.replace(/ /g, '');

  if (text.length === 0)
      return true;    
};