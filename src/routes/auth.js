const express = require('express')
const bcrypt = require('bcrypt')
const User = require('../model/user')
const authRouter = express.Router()


authRouter.post("/signup",async(req,res) =>{
  try{
    SignUpValidator(req)
    const {firstName,lastName,emailId,password,gender,skills,about,age} = req.body
    const hashedPassword = await bcrypt.hash(password,10)
    
 
  const newUser = new User({
    firstName:firstName,
    lastName:lastName,
    emailId : emailId,
    password : hashedPassword
  })

  await newUser.save()
 
  res.send("User added successfully")
} catch(err) {
  console.log("Error in adding the user" + err.message)
}
})


authRouter.post("/login",async(req,res) => {
  try{
    const {emailId,password} = req.body

    const user = await User.findOne({emailId:emailId})
    // console.log(user)
    if(!user) throw new Error("Invalid EmailId")
    const comparePassword = await bcrypt.compare(password,user.password)
    if(!comparePassword)
    {
      throw new Error("Invalid credentials")
    }
    else{
      // const token = jwt.sign({_id:user._id},"DevTinder@123")
      const token = await user.getJwt()
      res.cookie("token",token)
      res.send("Login successful")
    }


  } catch(err)
  {
    console.log("Error :" + err.message)
  }
})

authRouter.post('/logout',async(req,res) => {
  res.cookie("token",null,{expires: new Date (Date.now())})
  res.send("Logout successfull")
})


module.exports =  authRouter