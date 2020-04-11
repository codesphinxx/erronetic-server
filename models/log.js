var mongoose = require('mongoose');

var logSchema = new mongoose.Schema({
    app:String,
    ip:String,
    comment:String,
    country:String,
    country_code:String,
    archive:{
        type:Boolean,
        default:false
    },
    status:{
        type:Number,
        enum:[1000,1001,1002],
        default:1000
    },
    createdon:{
        type:Date,
        default:Date.now
    },
    data:mongoose.SchemaTypes.Mixed
});

module.exports = mongoose.model('Log', logSchema);