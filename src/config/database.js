const mongoose = require('mongoose')


const url = 'mongodb+srv://vijay17:Vijay1357@devtinder.kmzfg.mongodb.net/devTinder'

const mongodb = async () =>{
  
     await mongoose.connect(url)
     console.log("Connection established")

 
}



module.exports = mongodb;





