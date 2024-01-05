/*
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
 */
 const dotenv = require("dotenv");
 const express = require("express");
 const cors = require("cors");
 const maill = require("./mail/email");
 const Mydb = require("./model/khatamodel");
 const { sendEmail } = require("./mail/email");
 const connectDb=require("./db/connection")
 
 dotenv.config();
 const app = express();
 const port = process.env.PORT || 4000;
 
 app.use(express.json());
 app.use(cors({
   origin: '*',
   credentials: true,
   optionSuccessStatus: 200,
 }));
 
 // Send reminder email
 app.get("/remind", async (req, res) => {
   const currentDate = new Date().getTime();
   console.log(currentDate);
   const data = await Mydb.find();
 
   for (const record of data) {
     const paymentDate = new Date(record.paydate).getTime() + 43200100;
 
     if (currentDate > paymentDate) {
       const user = record.name;
       const userEmail = record.gmail;
       const leftAmount = record.amount;
 
       if (+leftAmount < 0) {
         const absoluteAmount = Math.abs(+leftAmount);
         console.log(`Email sent to ${user}`);
         sendEmail(userEmail, `Hey ${user}, please pay ${absoluteAmount} at Jimmy grocery shop as the last date has already passed`);
       }
     }
   }
 
   res.send("Email sent");
 });
 
 // Get customer data
 app.get("/getcustomer", async (req, res) => {
   const data = await Mydb.find();
   res.send(data);
 });
 
 // Save and get todo
 app.post("/savedata", async (req, res) => {
   const { lastdate, type, amountval, gmail, val, phoneno } = req.body;
   const amntToSave = type === "debit" ? -amountval : amountval;
 
   try {
     const existingName = await Mydb.findOne({ name: val });
     const existingNumber = await Mydb.findOne({ phone: phoneno });
 
     if (existingName) {
       res.send(existingName);
     } else if (existingNumber) {
       res.send(existingNumber);
     } else {
       await sendEmail(gmail, `Hey ${val} at JimmyWell grocery store, an account has been created, and ${amntToSave} has been credited`);
       const saveTodo = new Mydb({
         name: val,
         amount: amntToSave,
         phone: phoneno,
         gmail: gmail,
         paytype: type,
         paydate: lastdate,
       });
 
       await saveTodo.save();
       const data = await Mydb.find();
       res.send(data);
     }
   } catch (error) {
     console.error(error);
     res.status(500).send("Internal Server Error");
   }
 });
 
 // Delete todo
 app.post("/delete", async (req, res) => {
   const { ind } = req.body;
 
   try {
     await Mydb.findByIdAndDelete({ _id: ind });
     const data = await Mydb.find();
     res.send(data);
   } catch (error) {
     console.error(error);
     res.status(500).send("Internal Server Error");
   }
 });
 
 // Update todo
 app.post("/updatedatabcknd", async (req, res) => {
   const { iid, val, amountval, phoneno, gmail, type, lastdate } = req.body;
 
   try {
     const dataa = await Mydb.findById(iid);
     const savedAmount = parseInt(dataa.amount);
     const newAmount = parseInt(amountval);
 
     let totalAmount = type === "debit" ? savedAmount - newAmount : savedAmount + newAmount;
 
     sendEmail(gmail, `Hey ${val} at JimmyWell grocery store, ${newAmount} has been ${type === "debit" ? "debited" : "credited"} from your account, and the total amount is ${totalAmount}`);
 
     await Mydb.findByIdAndUpdate(iid, {
       name: val,
       amount: totalAmount,
       phone: phoneno,
       gmail: gmail,
       type: type,
       paydate: lastdate,
       date: new Date(),
     });
 
     const data = await Mydb.find();
     res.send(data);
   } catch (error) {
     console.error(error);
     res.status(500).send("Internal Server Error");
   }
 });
 

 connectDb().then(()=>{

   app.listen(port, () => {
     console.log(`connection success and listening at port ${port}`);
   });
 }).catch((err)=>console.log(err.message))
 