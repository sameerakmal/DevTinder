const express = require("express");

const app = express();

app.use("/test", (req, res) => {
    res.send("Hello from the testing!!");
})
app.use("/get", (req, res) => {
    res.send("Hello from the get!!");
})
app.use("/", (req, res) => {
    res.send("Hello from the server!!");
})
app.listen(3000, () => {
    console.log("Server is listening");
});