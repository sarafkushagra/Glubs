const { Server } = require("socket.io")

let io

module.exports = {
    init: (server) => {
        io = new Server(server, {
            cors: {
                origin: ["http://localhost:5173", "https://glubs.vercel.app"],
                methods: ["GET", "POST"],
                credentials: true,
            },
        })

        io.on("connection", (socket) => {
            console.log("Client connected:", socket.id)

            socket.on("join", (userId) => {
                if (userId) {
                    socket.join(userId.toString())
                    console.log(`User ${userId} joined their notification room`)
                }
            })

            socket.on("disconnect", () => {
                console.log("Client disconnected:", socket.id)
            })
        })

        return io
    },
    getIO: () => {
        if (!io) {
            throw new Error("Socket.io not initialized!")
        }
        return io
    },
    sendNotification: (recipientId, data) => {
        if (io) {
            io.to(recipientId.toString()).emit("new_notification", data)
        }
    },
}
