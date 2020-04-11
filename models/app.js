var mongoose = require('mongoose');

var appSchema = new mongoose.Schema({
    id:String,
    name:String,
    createdby:String,
    apikey:String,
    createdon:{
        type:Date,
        default:Date.now
    }
});

module.exports = mongoose.model('App', appSchema);