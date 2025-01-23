require('dotenv').config();
const mongoose = require('mongoose')


const url = process.env.MONGO_URL



const mongodb = async () =>{
  
     await mongoose.connect(url)
     console.log("Connection established")

 
}



module.exports = mongodb;





