const express = require('express')
const app = express()

app.use("/",(req,res) =>{
  res.send("Test page")
})

app.use("/test",(req,res) =>{
  res.send("Testing request handlers")
})

app.use((req,res) =>{
  res.send("Hello")
})




app.listen(3000,() =>{
  console.log("Server is listening on port 3000")
})