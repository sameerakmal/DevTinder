const jwt = require("jsonwebtoken");
const User = require("../models/user")

const userAuth = async (req, res, next) => {
    try{
        const {token} = req.cookies;
        if(!token){
            throw new Error("Please login first");
        }

        const decodedObj = await jwt.verify(token, "Sameer@456");
        const {_id} = decodedObj;

        const user = await User.findById(_id);
        if(!user){
            throw new Error("User does not exist! Please sign up");
        }
        req.user = user;
        next();
    }
    catch (err) {
        res.status(400).send("Error : " + err.message);
    }
};

module.exports = {
    userAuth
};