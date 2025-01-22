const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  firstName : {
    type : String,
    required : true
    
  },
  lastName : {
    type : String
  },
  emailId : {
    type : String,
    required : true,
    unique : true,
    lowercase : true
  },
  password : {
    type : String,
    required : true
  },
  age : {
    type : Number
  },
  gender : {
    type : String,
    validate:{
    validator:function(value)
    {
      if(!["male","female","others"].includes(value)){
        throw new Error("Gender value is not valid");
      }
        


      }
    }
  },
  photoUrl : {
    type: String
  },
  about : {
    type : String,
    default : "This is my about page"
  },
  skills : {
    type : [String]
  }
},{
  timestamps:true
})

const UserModel = mongoose.model('User',UserSchema)

module.exports = UserModel