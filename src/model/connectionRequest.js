const mongoose = require('mongoose')

const ConnectionRequestSchema = new mongoose.Schema({
  fromUserId : {
    type : mongoose.Types.ObjectId,
    required : true,
    ref : "User"
  },

  toUserId : {
    type : mongoose.Types.ObjectId,
    required : true,
    ref : "User"
  },

  status : {
    type : String,
    required : true,
    enum : {
      values : ["interested", "ignored","accepted","rejected"],
      message : `{VALUE} is incorrect status type`
    }
  }

},{timestamps : true})

ConnectionRequestSchema.pre("save",function(next)
{
  const connectionRequest = this
  if(connectionRequest.fromUserId.equals(connectionRequest.toUserId))
  {
    throw new Error("You cannot send connection to yourself")
  }
  next()
})

ConnectionRequestSchema.index({fromUserId : 1,toUserId : 1})

const ConnectionRequestModel = mongoose.model("ConnectionRequest",ConnectionRequestSchema)

module.exports = ConnectionRequestModel