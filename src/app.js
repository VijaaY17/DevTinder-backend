const express = require('express')
const mongodb = require('./config/database.js')
const app = express()

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


