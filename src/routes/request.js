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


  const existingConnectionRequest = await ConnectionRequest.findOne({
    $or : [
      {fromUserId : fromUserId,toUserId : toUserId},
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

requestRouter.post("/request/review/:status/:requestId",userAuth,async (req,res) => {
  const status = req.params.status
  const requestId = req.params.requestId
  const allowedStatus = ["accepted","rejected"]
  const loggedInUser = req.user
  const isAllowed = allowedStatus.includes(status)
  if(!isAllowed)
  {
    throw new Error("Invalid status")
  }
  const connectionRequest = await ConnectionRequest.findOne({
    toUserId : loggedInUser._id,
    _id : requestId,
    status : "interested"
  })
  if(!connectionRequest)
  {
    throw new Error("Connection request not found")
  }
  connectionRequest.status = status
  const data = await connectionRequest.save()
  res.send(data)
})

module.exports = requestRouter