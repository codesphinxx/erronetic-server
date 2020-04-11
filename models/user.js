var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    id:String,
    name:String,
    accountType:{
        type:Number,
        enum:[1000,2000,3000],
        default:1000
    },
    facebook         : {
        id           : String,
        token        : String,
        name         : String,
        displayName  : String
    },
    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    createdon:{
        type:Date,
        default:Date.now
    }
});

module.exports = mongoose.model('User', userSchema);
