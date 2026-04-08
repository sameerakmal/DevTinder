const express = require("express");
const { userAuth } = require("../middlewares/auth");
const paymentRouter = express.Router();
const razorpayInstance = require("../utils/razorpay");
const Payment = require("../models/payment");
const { membershipAmount } = require("../utils/constants");
const {validateWebhookSignature} = require('razorpay/dist/utils/razorpay-utils');
const User = require("../models/user");

paymentRouter.post("/payment/create", userAuth, async (req, res) => {
    const {membershipType} = req.body;
    const {firstName, lastName, emaildId, photoUrl} = req.user;
    try{
        var options = {
            amount: membershipAmount[membershipType] * 100,
            currency: "INR",
            receipt: "order_rcptid_11",
            notes : {
                firstName : firstName,
                lastName : lastName,
                emaildId : emaildId,
                membershipType : membershipType
            }
        };
        
        await razorpayInstance.orders.create(options, async function(err, order) {

            const payment = new Payment({
                userId : req.user._id,
                orderId : order.id,
                status : order.status,
                amount : order.amount,
                currency : order.currency,
                receipt : order.receipt,
                notes : order.notes,
            })

            const savedPayment = await payment.save();

            res.json({ ...savedPayment.toJSON(), keyId : process.env.RAZORPAY_KEY_ID, photoUrl : photoUrl });
            
            
        });
        
    }catch(err){
        console.log(err);
    }
});

paymentRouter.post("/payment/webhook",express.raw({ type: "*/*" }), async (req, res) => {
    try{  
        const webhookSignature = req.headers["x-razorpay-signature"];
        
        const isWebhookValid = validateWebhookSignature(
            req.body, 
            webhookSignature, 
            process.env.RAZORPAY_WEBHOOK_SECRET
        );

        if(!isWebhookValid){
            return res.status(400).json({msg : "Webhook signature is not valid"});
        }
        const body = JSON.parse(req.body.toString());
        const paymentDetails = body.payload.payment.entity;
        const payment = await Payment.findOne({orderId : paymentDetails.order_id});
        payment.status = paymentDetails.status;
        await payment.save();

        console.log(paymentDetails);
        
        const user = await User.findOne({ _id : payment.userId});
        user.isPremium = true;
        user.membershipType = payment.notes.membershipType;
        await user.save();

        // if(req.body.event === "payment.captured"){
            
        // }
        // if(req.body.event === "payment.failed"){

        // }

        
        return res.status(200).json({msg : "Webhook received succesfully!"});
    }catch(err){
        console.error("🔥 ERROR:", err);
        return res.status(500).json({ msg: err.message });
    }

});

paymentRouter.get("/premium/verify", userAuth, async (req, res) => {
    try{
        const user = req.user;
        if(user.isPremium){
            return res.json({isPremium : true});
        }
        else{
            return res.json({isPremium : false});
        }
    }catch(err){
        return res.status(500).json({msg : err.message});
    }
})

module.exports = paymentRouter;