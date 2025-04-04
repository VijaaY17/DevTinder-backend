const express = require('express')
const { userAuth } = require('../middleware/userAuth')
const ConnectionRequest = require('../model/connectionRequest')
const User = require('../model/user')
const userRouter = express.Router()


userRouter.get("/user/requests/received",userAuth,async(req,res) => {
  try{
  const loggedInUser = req.user
  const connectionRequest = await ConnectionRequest.find({
    toUserId : loggedInUser._id,
    status : "interested"
  }).populate("fromUserId",["firstName","lastName"])


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
  // console.log(loggedInUser)
  const connectionRequest = await ConnectionRequest.find({
    $or: [
      { toUserId: loggedInUser._id, status: "accepted" }, 
      { fromUserId: loggedInUser._id, status: "accepted" }
    ]
  })
  .populate("fromUserId", ["firstName", "lastName","about"])
  .populate("toUserId", ["firstName", "lastName","about"]);
  // console.log(connectionRequest)

  const data = connectionRequest.map((row) =>{
    if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
       return row.toUserId
    }
    return row.fromUserId
  })


  // res.send({
  //   message : "Connections",
  //   data : connectionRequest
  // })
  res.json({ data });

}catch(err)
{
  res.status(400).send("Error : " + err.message)
}
})


// avy logged in

userRouter.get("/user/feed",userAuth,async(req,res) => {
  try{
  const loggedInUser = req.user
  let limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1
  const skip = (page-1)*limit
  limit = limit > 50 ? 50 : limit
  
  const connectionRequest = await ConnectionRequest.find({
    $or : [{fromUserId : loggedInUser._id},{toUserId : loggedInUser._id}]
  }).select("fromUserId toUserId")
  // res.send(connectionRequest)
  const hideUsersFromFeed = new Set() 
  connectionRequest.forEach((req) => {
    hideUsersFromFeed.add(req.fromUserId.toString())
    hideUsersFromFeed.add(req.toUserId.toString())
  })
  console.log(connectionRequest)

  const users = await User.find({
    $and : [ {_id: {$nin : Array.from(hideUsersFromFeed)}},
             {_id: {$ne : loggedInUser._id}}
    ]
  }).select("firstName lastName gender skills about ").skip(skip).limit(limit)

  res.send(users)


  } catch(err)
  {
    res.status(400).send("Error : "+ err.message)
  }
})


module.exports = userRouter