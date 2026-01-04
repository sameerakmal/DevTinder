const express = require("express");
const {validSignUpData} = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const authRouter = express.Router();

authRouter.post("/signup",
    async (req, res) => {
        try{
            //validating signup data
            validSignUpData(req);
            
            const {firstName, lastName, emailId, password} = req.body;
            const passwordHash = await bcrypt.hash(password, 10);
            
            const user = new User({
                firstName,
                lastName,
                emailId,
                password : passwordHash
            });
            await user.save();
            res.send("User added successfully");
        }
        catch(err){
            res.status(400).send("Error saving the user : " + err.message);
        }
    }
);

authRouter.post("/login", async (req, res) => {
    try {
        // Extract email and password sent by client in JSON body
        // Requires: app.use(express.json())
        const { emailId, password } = req.body;

        // Find user in DB using email
        const user = await User.findOne({ emailId: emailId });

        // If user does not exist, stop immediately
        if (!user) {
            throw new Error("Invalid credentials");
        }

        // Compare plain password with hashed password stored in DB
        // bcrypt.compare hashes the input password and checks equality
        const isPasswordValid = await user.validatePassword(password);

        if (isPasswordValid) {
            
            const token = await user.getJWT();

            res.cookie("token", token, {maxAge : 7 * 24 * 60 * 60 * 1000});

            res.send("Login successful!!");
        } else {
            throw new Error(" Invalid credentials");
        }

    } catch (err) {
        res.status(400).send("Error : " + err.message);
    }
});

authRouter.post("/logout", (req, res) => {
    res
    .cookie("token", null, {
        maxAge : 0
    })
    .send("Logged out successfully!!");
    
});
module.exports = {authRouter};