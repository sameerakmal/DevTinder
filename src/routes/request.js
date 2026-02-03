const express = require("express");
const {userAuth} = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const requestRouter = express.Router();
const sendEmail = require("../utils/sendEmail");


requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try{
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;
        const toUser = await User.findById(toUserId);
        
        const allowedStatus = ["interested", "ignored"];
        if(!allowedStatus.includes(status)){
            throw new Error("Invalid status type : " + status);
        }

        const connectionRequestExists = await ConnectionRequest.findOne({
            $or: 
            [
                { fromUserId, toUserId },
                { fromUserId : toUserId, toUserId : fromUserId }
            ],
        });
        if(connectionRequestExists){
            throw new Error("Connection Request already exists!!");
        }

        const userExists = await User.findOne({
            _id : toUserId
        })
        if(!userExists){
            throw new Error("User doesn't exist");
        }


        const connectionRequest = new ConnectionRequest({
            fromUserId : fromUserId,
            toUserId : toUserId,
            status : status
        });
        const data = await connectionRequest.save();

        const emailRes = await sendEmail.run(
             "A new friend request from " + req.user.firstName,
            req.user.firstName + " is " + status + " in " + toUser.firstName
        );
        console.log(emailRes);
        

        res.json({
            message : `${req.user.firstName} ${status} ${toUser.firstName}`,
            data
        });
        
    }catch (err) {
        res.status(400).send("Error : " + err.message);
    }
})


requestRouter.post("/request/review/:status/:requestId", userAuth, async(req, res) => {
    try{
        const loggedInUser = req.user;
        const {status, requestId} = req.params;

        const allowedStatus = ["accepted","rejected"];
        if(!allowedStatus.includes(status)){
            throw new Error("Invalid status type : " + status);
        }


        const connectionRequest = await ConnectionRequest.findOne({
            _id : requestId,
            toUserId : loggedInUser._id,
            status : "interested"
        })
        if(!connectionRequest){
            throw new Error("Connection request doesn't exist!");
        }


        connectionRequest.status = status;
        const data = await connectionRequest.save();

        res.json({
            message : "Connection request " + status,
            data
        });
    }catch (err) {
        res.status(400).send("Error : " + err.message);
    }
})
module.exports = {
    requestRouter
};