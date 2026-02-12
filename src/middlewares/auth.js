const jwt = require("jsonwebtoken");
const User = require("../models/user")

const userAuth = async (req, res, next) => {
    try{
        const {token} = req.cookies;
        if(!token){
            res.status(401).send("Please login");
        }

        const decodedObj = await jwt.verify(token, process.env.JWT_SECRET);
        const {_id} = decodedObj;

        const user = await User.findById(_id);
        if(!user){
            return res.status(404).send("User does not exist! Please sign up");
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