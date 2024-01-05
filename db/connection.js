require('dotenv').config()
const url=process.env.MONGO_URL
console.log(url)
const mongoose=require("mongoose")
const connectDb= ()=>{

  return  mongoose.connect(url)
   
}
module.exports=connectDb