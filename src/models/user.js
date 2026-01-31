const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userSchema = mongoose.Schema(
    {
        firstName : {
            type : String,
            required : true,
            maxLength : 40
        },
        lastName : {
            type : String,
        },
        emailId : {
            type : String,
            required : true,
            unique : true,
            trim : true,
            lowercase : true,
            validate(value){
                if(!validator.isEmail(value)){
                    throw new Error("Invalid Email address : " + value);
                }
            }
        },
        password : {
            type : String,
            required : true,
            validate(value){
                if(!validator.isStrongPassword(value)){
                    throw new Error("Weak password!");
                }
            }
        },
        age : {
            type : String,
        },
        gender : {
            type : String,
            enum : {
                values : ["", "male", "female", "other"],
                message : `{VALUE} is not correct status type`
            }
        },
        photoUrl : {
            type : "String",
            default : "https://cdn.vectorstock.com/i/500p/29/52/faceless-male-avatar-in-hoodie-vector-56412952.jpg",
            validate(value){
                if(!validator.isURL(value)){
                    throw new Error("Invalid photo URL : " + value);
                }
            }
        },
        about : {
            type : "String",
            default : "This is default about the user!!"
        },
        skills : {
            type : [String]
        }
    },
    {
        timestamps : true,
    }

)

userSchema.methods.getJWT = async function(){
    const user = this;

    const token = await jwt.sign({_id : user._id}, "Sameer@456", {
        expiresIn : "7d"
    });

    return token;
}
userSchema.methods.validatePassword = async function(passwordInputByUser) {
    const user = this;
    const passwordHash = user.password;
    const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash);
    return isPasswordValid;
}
module.exports = mongoose.model("User", userSchema); 