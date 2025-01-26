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

// const isValidateEditProfile = (req,res) => {
//   const allowedUpdates = ["firstName","lastName","age","about","skills","gender"]
//   const isUpdateAllowed = Object.keys(req.body).every((key) => allowedUpdates.includes(key))
//   return isUpdateAllowed
// }

const isValidateEditProfile = (req) => {
  const allowedUpdates = ["firstName", "lastName", "age", "about", "skills", "gender"];
  const isUpdateAllowed = Object.keys(req.body).every((key) => allowedUpdates.includes(key));
  return isUpdateAllowed;
};


module.exports = {
  SignUpValidator,
  isValidateEditProfile,
}