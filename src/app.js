const express = require('express')
const mongodb = require('./config/database.js')
const User = require('./model/user.js')
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const {SignUpValidator} = require('./utils/validation.js')
const {userAuth} = require('./middleware/userAuth.js')
const cors = require('cors')
const app = express()
const authRouter = require('./routes/auth.js')
const profileRouter = require('./routes/profile.js')
const requestRouter = require('./routes/request.js')
const userRouter = require('./routes/user.js')
const http = require('http')

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  res.sendStatus(204);
});

app.use(express.json())
app.use(cookieParser())
app.use("/",authRouter)
app.use("/",profileRouter)
app.use("/",requestRouter)
app.use("/",userRouter)

// app.use("/",(req,res) =>{
//   res.send("Test page")
// })

// app.use("/test",(req,res) =>{
//   res.send("Testing request handlers")
// })

// app.use((req,res) =>{
//   res.send("Hello")
// })
// app.use("/test",(req,res) =>{
//   res.send("use method")
// })
app.get("/test/:userid",(req,res) =>{
  console.log(req.params)
  res.send("Get request")
})

app.post("/test",(req,res) =>{
  res.send("Post request")
})







app.get("/user",async(req,res) =>{
  try{
  const name = req.body.firstName
  console.log(name)
  const available =  await User.findById({firstName:name})
  console.log(available)
    res.send(available)
} catch(err)
{
  res.status(404).send("Email could not find")
}
})

app.get("/feed",async(req,res) =>{
  try{
      const data = await User.find({})
      if(!data)
      {
        res.status(404).send("No data found")
      }
      else{
      res.send(data)
      }
  } catch(err)
  {
      console.log("No user found")
  }

})

app.patch("/user/:userId",async(req,res) =>{
  try{
  // const id = req.body._id
  const userId = req.params.userId
  const data = req.body
  const allowed_updates = ['firstName','lastName','password','skills','about']
  // const isUpdateAllowed = Object.keys(data).every((k) => allowed_updates.includes(k))
  const isUpdateAllowed = Object.keys(data).every((key) => allowed_updates.includes(key));
  if(!isUpdateAllowed) throw new Error("Cannot be updated")
  const updated = await User.findByIdAndUpdate(userId,data,{new:true, runValidators: true })
  if (!updated) {
    return res.status(404).send("User not found.");
  }
  console.log(updated)
  res.send(updated)
  } catch(err)
  {
    console.log("Cannot update:" + err.message)
  }
})

app.delete("/user",async(req,res) => {
  
  try{
    const id = req.body.id
      await User.findOneAndDelete({_id:id})
      res.send("Deleted successfully")

  }catch(err)
  {
    console.log("Cant delete")
  }
})

app.delete("/test",(req,res,next) =>{
  res.send("Deleted")
})

app.use("/user",[(req,res,next) =>{
  console.log("1st user")
  next()
}],
(req,res,next) =>{
  res.send("USER 1")
  next()
},
(req,res) =>{
  console.log("User 3")
  res.send("User 3")
})

const server = http.createServer(app)

mongodb().then(()=>{
  server.listen(3000, () =>{
    console.log("Server is listening on port 3000")
  })
})


