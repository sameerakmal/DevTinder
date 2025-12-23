const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
    {
        firstName : {
            type : String,
            required : true,
            minLength : 5,
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
            lowercase : true
        },
        password : {
            type : String,
            required : true
        },
        age : {
            type : String,
        },
        gender : {
            type : String,
            validate(value){
                if(!["male", "female", "others"].includes(value)){
                    throw new Error("Gender data is not valid");
                }
            }
        },
        photoUrl : {
            type : "String",
            default : "https://cdn.vectorstock.com/i/500p/29/52/faceless-male-avatar-in-hoodie-vector-56412952.jpg"
        },
        skills : {
            type : [String]
        }
    },
    {
        timestamps : true,
    }

)

module.exports = mongoose.model("User", userSchema); 