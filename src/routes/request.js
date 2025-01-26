const express = require('express')
const ConnectionRequest = require('../model/connectionRequest')
const {userAuth} = require('../middleware/userAuth')
const User = require('../model/user')
const requestRouter = express.Router()

requestRouter.post('/request/send/:status/:userId',userAuth,async(req,res) => {
  try{
  
  const fromUserId = req.user._id 
  const toUserId = req.params.userId
  const status = req.params.status

  const allowedStatus = ["ignored","interested"]

  const isAllowed = allowedStatus.includes(status)
  if(!isAllowed)
  {
    throw new Error("Invalid status")
  }
  const existingToUserId = await User.findById(toUserId)
  if(!existingToUserId)
  {
    throw new error("User is invalid")
  }


  const existingConnectionRequest = ConnectionRequest.findOne({
    $or : [
      {fromUserId,toUserId},
      {fromUserId : toUserId, toUserId : fromUserId}
    ]
  })
  
  if(existingConnectionRequest)
  {
    throw new Error("Connection request already exists")
  }

  const connectionRequest = new ConnectionRequest({
    fromUserId : fromUserId,
    toUserId : toUserId,
    status : status
  })

  const data = await connectionRequest.save()
  res.send(data)
} catch(err)
{
  res.status(400).send("Error : " + err.message)
}

})

module.exports = requestRouter