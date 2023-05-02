
const mongoose = require('mongoose');
const { UserModel } = require('./user.model');

const seachSchema = mongoose.Schema({
    userID : {type:mongoose.Schema.Types.ObjectId, ref:UserModel, required:true},
    searches : [{type:String, required:true}]
},{
    versionKey : false
})

const SearchModel = mongoose.model("search", seachSchema);


module.exports = {
    SearchModel
}