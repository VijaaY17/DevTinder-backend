const validator = require('validator')
const SignUpValidator = (req) =>
{
  const {firstName,emailId} = req.body
    if(!firstName){
      throw new Error("Name should be filled")
    }

    if(!validator.isEmail(emailId))
    {
      throw new Error("Invalid Email")

    }

    


}


module.exports = {
  SignUpValidator
}