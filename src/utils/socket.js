const socket = require("socket.io");

const initializeSocket = (server) =>{
    const io = socket(server, {
    cors: {
        origin: [
            "http://localhost:5173",
            "https://dev-tinder-web-ruby.vercel.app"
        ],
        credentials: true
    }
    });

    io.on("connection", (socket) => {
        socket.on("joinChat", ({toUserId, fromUserId}) => {
            const roomId = [toUserId, fromUserId].sort().join("_");
            console.log("Joining room : " + roomId);
            socket.join(roomId);
        });
        socket.on("sendMessage", ({firstName, fromUserId, toUserId, text}) => {
            const roomId = [toUserId, fromUserId].sort().join("_");
            console.log(firstName + " " + text );
            io.to(roomId).emit("messageReceived", {firstName, text});
        });
        socket.on("disconnect", () => {});
    });
}

module.exports = initializeSocket;
