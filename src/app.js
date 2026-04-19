require("dotenv").config();
const express = require("express");
const app = express();
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const {authRouter} = require("./routes/auth");
const { profileRouter } = require("./routes/profile");
const { requestRouter } = require("./routes/request");
const {userRouter} = require("./routes/user");
const paymentRouter = require("./routes/payment");
const http = require("http");
const initializeSocket = require("./utils/socket");

app.use("/payment/webhook", express.raw({ type: "application/json" }));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://dev-tinder-web-ruby.vercel.app"
    ],
    credentials: true
}));
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", paymentRouter);
require("./utils/cronJob");

app.get("/", (req, res) => {
    res.send("Server is alive");
});

const server = http.createServer(app);
initializeSocket(server);

connectDB()
    .then(() => {
        console.log("Database connection established");
        server.listen(process.env.PORT, () => {
            console.log("Server is successfully listening to port no 3000");
        });
    })
    .catch((err) => {
        console.error("Database connection failed:", err.message);
    })
