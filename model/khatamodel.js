
const mongoose = require("mongoose")
require("../db/connection")

const playlistSchema= new mongoose.Schema({
name:String,
amount:Number,
phone:String,
gmail:String,
type:String,
paydate:Date,
date:{type:String,default:() => new Date(new Date())}

})
const Mydb=new mongoose.model("Mydb",playlistSchema)

module.exports=Mydb