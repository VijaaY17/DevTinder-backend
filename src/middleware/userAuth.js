const jwt = require('jsonwebtoken')
const User = require('../model/user')

const userAuth = async(req,res,next) => {
  try
  {
    const {token} = req.cookies
    const validToken = await jwt.verify(token,"DevTinder@123")
    const {_id} = validToken
    const user = await User.findById(_id)
    if(!user)
    {
      throw new Error ("Invalid user")
    }
    req.user = user
    next()


  } catch(err)
  {
    console.log("Error : "+ err.message)
  }

}
module.exports = {
  userAuth
}