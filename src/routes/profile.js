const express = require('express')
const {userAuth} = require('../middleware/userAuth.js')
const {isValidateEditProfile} = require('../utils/validation.js')
const profileRouter = express.Router()


profileRouter.get("/profile",userAuth,async(req,res) =>{
  try{
  // const cookie = req.cookies
  // console.log(cookie)
  // const {token} = cookie
  // if(!token) throw new Error("Invalid token")
  // console.log(token)
  // const isValidToken = await jwt.verify(token,"DevTinder@123")
  // console.log(isValidToken)
  // const {_id} = isValidToken
  // const user = await User.findById(_id)
  // if(!user) throw new Error("Invalid user")
  
  const user = req.user
  res.send(user)

  } catch(err)
  {
    console.log("Error : " + err.message)
  }

})

profileRouter.patch('/profile/edit',userAuth,async(req,res) => {
  try{
    if(!isValidateEditProfile(req)){
      throw new Error("You cannot edit these fields")
    }
    const loggedInUser = req.user
    console.log(loggedInUser)

    Object.keys(req.body).forEach((key) => (loggedInUser[key]) = (req.body[key]))
    console.log(loggedInUser)
    
    await loggedInUser.save()
    res.json({
      data : loggedInUser 
    })

   



  } catch(err)
  {
    console.error("Error:", err.message);
    res.status(400).send({ error: err.message });
  }
})




module.exports =  profileRouter
