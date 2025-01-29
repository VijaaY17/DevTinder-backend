const express = require('express')
const { userAuth } = require('../middleware/userAuth')
const ConnectionRequest = require('../model/connectionRequest')
const userRouter = express.Router()


userRouter.get("/user/requests/received",userAuth,async(req,res) => {
  try{
  const loggedInUser = req.user
  const connectionRequest = await ConnectionRequest.find({
    toUserId : loggedInUser._id,
    status : "interested"
  }).populate("fromUserId",[firstName,lastName])


  res.json({
    message : "Data fetched successfully",
    data : connectionRequest
  })
} catch(err)
{
  res.status(404).send("Error : " +err.message)
  
}
})

userRouter.get("/user/connections",userAuth,async(req,res) =>{
  try{
  const loggedInUser = req.user
  const connectionRequest = await ConnectionRequest.find({
    $or : [
      {
        toUserId : loggedInUser._id,status : "accepted",
        fromUserId : loggedInUser._id, status : "accepted"

      }
    ]

  }).populate("fromUserId",["firstName","lastName"])
  .populate("toUserId",["firstName","lastName"])

  const data = connectionRequest.map((row) =>{
    if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
       return row.toUserId
    }
    return row.fromUserId
  })


  res.send({
    message : "Connections",
    data : connectionRequest
  })

}catch(err)
{
  res.status(400).send("Error : " + err.message)
}
})



module.exports = userRouter