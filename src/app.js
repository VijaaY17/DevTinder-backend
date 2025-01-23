const express = require('express')
const mongodb = require('./config/database.js')
const User = require('./model/user.js')
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const {SignUpValidator} = require('./utils/validation.js')
const {userAuth} = require('./middleware/userAuth.js')
const app = express()


app.use(express.json())
app.use(cookieParser())

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

app.get("/profile",userAuth,async(req,res) =>{
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
  // console.log(user) 
  const user = req.user
  res.send(user)

  } catch(err)
  {
    console.log("Error : " + err.message)
  }

})

app.post("/signup",async(req,res) =>{
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

app.post("/login",async(req,res) => {
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
      const token = jwt.sign({_id:user._id},"DevTinder@123")
      res.cookie("token",token)
      res.send("Login successful")
    }


  } catch(err)
  {
    console.log("Error :" + err.message)
  }
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

mongodb().then(()=>{
  app.listen(3000, () =>{
    console.log("Server is listening on port 3000")
  })
})


