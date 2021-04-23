const mongoose = require("mongoose")

require("dotenv").config();
const db = process.env.MONGODB_URI || process.env.DB
mongoose.connect(db,{
    useCreateIndex:true,
    useNewUrlParser: true,
    useUnifiedTopology:true,
    useFindAndModify: false,
}).then(()=>{
    console.log("Connected");
}).catch((e)=>{
    console.log(e)
})
