const express = require("express")
const app = express()
require("dotenv").config();
const port = process.env.PORT||8000;
const bcrypt = require("bcryptjs")
require("./db/conn")
const User = require("./db/schema/UserSchema")
const stripe = require("stripe")(process.env.STRIPE_SECRET_TEST);
const cors = require("cors");
var jwt = require('jsonwebtoken');
app.use(cors());

app.use(express.json());

app.get("/users",async(req,res)=>{
    const email = req.query.email;
    const password = req.query.password;
    const users = await User.findOne({email})
    if(typeof(users)==="undefined"){
        res.send("User Not found")
    }else{
        
        try{
            if(await bcrypt.compare(password,users.password)){
                var token = await jwt.sign({ id: users._id }, process.env.SECRET, {});
                const _id = users._id
                await User.updateOne({_id},{ $set: {token: token}})
                res.cookie("token",token,{
                    httpOnly:true
                })
                res.send(users)
            }else{
                res.send("Invalid Password")
            }
        }catch(e){
            res.send("Something Went Wrong!!")
        }
    }
})
app.post("/register",async(req,res)=>{
    const email = req.body.email
    const password = await bcrypt.hash(req.body.password,12);
    const users = await User.find({email})
    if(typeof(users[0])==="undefined"){
        try{
            const user = await new User({
                name:req.body.name,
                email,
                password
            })
            await user.save()
            res.send("Registered Successfully!!")
           
        }catch(e){
            res.send("Something errorOccured")
        }
    }else{
        res.send("Email already registered!!")
    }
})


app.post("/stripe/charge", cors(), async (req, res) => {
    let { amount, id } = req.body;
    try {
      const payment = await stripe.paymentIntents.create({
          
        amount: amount,
        currency: "INR",
        description: "Your Company Description",
        payment_method: id,
        confirm: true,
      });
      console.log("success");
      res.json({
        message: "Payment Successful",
        success: true,
      });
    } catch (error) {
      console.log("failed");
      res.json({
        message: "Payment Failed",
        success: false,
      });
    }
  });

app.post("/orders",async(req,res)=>{
    const orders = req.body;3
    try{
    const user=await User.updateOne({_id:orders.id},{ $set: {orders: orders.basket }})
    res.send("Success")
    }catch(e){
        res.send("Failed")
    }
    
})
app.get("/orders",async(req,res)=>{
    const _id = req.query.id
    try{
    const user = await User.findOne({_id})
    res.send(user.orders)
    }catch(e){
        console.log(e)
    }

})

app.get("/ver",async(req,res)=>{
    const str = req.headers.cookie
    if(!str){
        res.send("No String")
    }else{
        const ver = await jwt.verify(str.slice(6),process.env.SECRET)
        const users = await User.findOne({_id:ver.id})
        res.send(users)
    }
        
})


if(process.env.NODE_ENV==="production"){
    app.use(express.static("client/build"))
}
app.listen(port,()=>{
    console.log(`Listening at ${port}`)
})