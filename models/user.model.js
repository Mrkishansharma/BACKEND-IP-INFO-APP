
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    email : {type:String, required:true, unique:true},
    pass : {type:String, required:true},
    name : {type:String, required:true}
},{
    versionKey : false
})

const UserModel = mongoose.model("user", userSchema);


module.exports = {
    UserModel
}