const express = require("express");
const app = express();
const connectDB = require("./config/database");
connectDB()
    .then(() => {
        console.log("Database connection established");
        app.listen(3000, () => {
            console.log("Server is listening");
        });
    })
    .catch(() => {
        console.log("Database not connected");
    })
