const validator = require("validator");
const validSignUpData = ((req) => {
    const {firstName, lastName, emailId, password} = req.body;

    if(!firstName || !lastName) {
        throw new Error("Name not valid");
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("EmailId is not valid");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Please enter a strong password!!");
    }
})

const validEditProfileData = (req) => {
    const allowedUpdates = ["firstName", "lastName","age", "gender", "photoUrl", "about","skills"];
    const isEditAllowed = Object.keys(req.body).every((key) => {
        allowedUpdates.includes(key);
    })
    console.log(isEditAllowed);
    
    return isEditAllowed;
}

const validPassword = (req) => {
    if(!validator.isStrongPassword(req)){
        throw new Error("Please enter strong password");
    }
}
module.exports = {validSignUpData, validEditProfileData, validPassword};