const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");
app.use(express.json());

app.post("/signup",
    async (req, res) => {
        console.log(req.body);
        const user = new User(req.body);
        try{    
            await user.save();
            res.send("User added successfully");
        }
        catch(err){
            res.status(400).send("Error saving the user : " + err.message);
        }
    }
);
app.get("/user", 
    async (req, res) => {
        const userEmail = req.body.emailId;
            console.log(userEmail);
        try{
            const user = await User.find({emailId : userEmail});
            if(!user){
                res.status(400).send("User not found");
            }
            else{
                res.send(user);
            }
        }
        catch(err){
            res.status(400).send("Something went wrong");
        }
    }
)
app.get("/feed",
    async (req, res) => {
        try{
            const users = await User.find();
            if(!users){
                res.status(400).send("No users found");
            }
            else{
                res.send(users);
            }

        }
        catch(err){
            res.status(400).send("Something went wrong");
        }
    }
)
app.delete("/user", 
    async (req, res) => {
        const userId = req.body.userId;
        try{
            const user = await User.findByIdAndDelete(userId);
            // const user = await User.findByIdAndDelete({_id : userId});
            res.send("User deleted successfully");
        }
        catch(err){
            res.status(400).send("Something went wrong");
        }
    }
)
app.patch("/user", 
    async (req, res) => {
        const data = req.body;
        const userId = req.body.userId;
        try{
            const user = await User.findByIdAndUpdate(userId, data, {runValidators : true});
            console.log(user);
            res.send("User updated successfully");
        }
        catch(err){
            res.status(400).send("UPDATE FAILED " + err.message);
        }
    }
)


connectDB()
    .then(() => {
        console.log("Database connection established");
        app.listen(3000, () => {
            console.log("Server is successfully listening to port no 3000");
        });
    })
    .catch(() => {
        console.log("Database not connected");
    })
