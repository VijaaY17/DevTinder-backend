require('dotenv').config();
const mongoose = require('mongoose')


const url = process.env.MONGO_URL
console.log(url)
console.log(process.env); 


const mongodb = async () =>{
  
     await mongoose.connect(url)
     console.log("Connection established")

 
}



module.exports = mongodb;





