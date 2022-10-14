const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
 username:{ type:String, unique:true, required:true,},
 password:{ type:String,required:true},
 email: { type: String, unique: true },
 created_at:{ type: Date,required: true,default: Date.now},
},
 )

 const userModel = mongoose.model('User', userSchema);

 module.exports=userModel