const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

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

UserSchema.methods.getJwt = async function ()
{
  const user = this
   const token = jwt.sign({_id:user._id},"DevTinder@123")
   return token

}

const UserModel = mongoose.model('User',UserSchema)

module.exports = UserModel