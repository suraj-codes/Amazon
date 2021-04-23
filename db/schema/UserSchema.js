const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    orders:{
        type:Array
    },
    token:{
        type:String
    }
});

const user = new mongoose.model("User",userSchema);
module.exports = user; 