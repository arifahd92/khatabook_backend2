dotenv = require("dotenv")
// require ("./mail/email")
const maill=require("./mail/email")
require("./db/connection")
require('dotenv').config()
const express = require("express")
const app = express()
const port = process.env.PORT|| 4000
let cors = require("cors")
const Mydb = require("./model/khatamodel")
app.use(express.json())

const corsOptions ={
   origin:'*', 
   credentials:true,            
   optionSuccessStatus:200,
}

app.use(cors(corsOptions))



//send reminder email
app.get("/remind", async (req,res)=>{
  let date= new Date().getTime()
  console.log(date)
const data = await Mydb.find()
for(var x in data ){
  console.log(new Date((data[x].paydate)).getTime())
  let lastdate=(new Date((data[x].paydate)).getTime())+(43200100)
  if(date>lastdate){
    let user = data[x].name
    console.log(user + "found")
    let useremail= data[x].gmail
    let leftamount= data[x].amount
    if((+leftamount)<0){
      let absoluteamount=Math.abs(+leftamount)
      console.log("email sent to ",user)
      maill.sendEmail(useremail,`hey ${user} please pay ${absoluteamount} at jimmy grocery shop as you know last date has already passed`)
    }

  }

}
res.send("email sent")
})
//getting todo
app.get("/getcustomer",async (req,res)=>{
  const data = await Mydb.find()
     res.send(data)//json data
  })

//save and get todo
app.post("/savedata",async (req,res)=>{
  let mydate=req.body.lastdate
  let paymenttype= req.body.type
  var amnttosave
  console.log("i m paymetn type ki value",paymenttype)
  if(paymenttype=="debit"){
    console.log("debit was selected")
    amnttosave=-req.body.amountval
    maill.sendEmail(req.body.gmail,`hey ${req.body.val} at JimmyWell grocery store an acount with your name has been created and ${amnttosave} has been credited`)
  }
  else{
    amnttosave=req.body.amountval
    maill.sendEmail(req.body.gmail,`hey ${req.body.val} at JimmyWell grocery store an acount with your name has been created and ${amnttosave} has been credited`)
  }
//  maill.sendEmail(req.body.gmail,amnttosave)
  var savetodo=new Mydb({//instance of our collection to save
    name:req.body.val,
    amount:amnttosave,
    phone:req.body.phoneno,
    gmail:req.body.gmail,
    paytype:req.body.type,
    paydate:mydate
   
  })
  let dupname= await Mydb.find({name:req.body.val})
  let dupnumber= await Mydb.find({phone:req.body.phoneno})
  console.log(dupname)
  if(dupname.length>0){
    res.send(dupname)//json data 
  }
  else if(dupnumber.length>0){
    res.send(dupnumber)//json data 
  }
 else{
   await savetodo.save()
   const data = await Mydb.find()
        res.send(data)//json data
 }
  })

  // delete todo
  app.post("/delete", async(req, res)=>{
    const id =req.body
    console.log(id)
    Mydb.findByIdAndDelete({_id:id.ind}).then(()=>{
      console.log("deleted")
    }).catch((err)=>console.log(err))
    const data = await Mydb.find()
       res.send(data)//json data

  })
  //todo update
  app.post("/updatedatabcknd", async(req, res)=>{
   let date= new Date()
   let {iid,val,amountval,phoneno,gmail,type,lastdate}=req.body
   let newamount=parseInt(amountval)
   const dataa = await Mydb.find({_id:iid})
   let savedamount=parseInt(dataa[0].amount)
   if(type=="debit"){
    let totalamount=(savedamount)-(newamount)
    maill.sendEmail(gmail,`hey ${val} at JimmyWell grocery store  ${newamount} has been debited from your account and total amount is ${totalamount}`)
    Mydb.findByIdAndUpdate(iid,{amount:totalamount}).then(()=>console.log("updated"))
   }
   else{
    let totalamount=(savedamount)+(newamount)
    maill.sendEmail(gmail,`hey ${val} at JimmyWell grocery store  ${newamount} has been credited in your account and total amount is ${totalamount}`)
    Mydb.findByIdAndUpdate(iid,{amount:totalamount}).then(()=>console.log("updated"))
   }
   Mydb.findByIdAndUpdate(iid,{name:val}).then(()=>console.log("updated"))
   Mydb.findByIdAndUpdate(iid,{phone:phoneno}).then(()=>console.log("updated"))
   Mydb.findByIdAndUpdate(iid,{gmail}).then(()=>console.log("updated"))
   Mydb.findByIdAndUpdate(iid,{type}).then(()=>console.log("updated"))
   Mydb.findByIdAndUpdate(iid,{paydate:lastdate}).then(()=>console.log("updated"))
   Mydb.findByIdAndUpdate(iid,{date}).then(()=>console.log("updated"))
   const data = await Mydb.find()
   res.send(data)
  })
 app.listen(port,()=>{
 console.log(`listening at port ${port}`)
 })