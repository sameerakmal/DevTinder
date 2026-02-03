const express = require("express");
const {userAuth} = require("../middlewares/auth");
const User = require("../models/user");
const profileRouter = express.Router();
const {validEditProfileData, validPassword} = require("../utils/validation");
const bcrypt = require("bcrypt");
// PROFILE ROUTE (PROTECTED)
profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user);
        
    } catch (err) {
        res.status(400).send("Error : " + err.message);
    }
});


profileRouter.patch("/profile/edit", userAuth, async(req, res) => {
    try{
        if(!validEditProfileData){
            throw new Error("Invalid Update Request");
        }

        const loggedInUser = req.user;
        Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
        
        await loggedInUser.save();
        res.json({
            message: `${loggedInUser.firstName}, your profile updated successfuly`,
            data: loggedInUser,
        });
        
    } catch (err) {
        res.status(400).send("Error : " + err.message);
    }
})
profileRouter.patch("/profile/password", userAuth, async (req, res) => {
    try{
        const user = req.user;
        const {oldPassword, newPassword} = req.body;

        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if(isPasswordValid){
            validPassword(newPassword);
            const passwordHash = await bcrypt.hash(newPassword, 10);
            user.password = passwordHash;
            user.save();
            res.send("Password changed successfully!!");
        }
    }catch (err) {
        res.status(400).send("Error : " + err.message);
    }
});


module.exports = {
    profileRouter
};
