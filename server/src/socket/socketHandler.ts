import { Server, Socket } from "socket.io";
import logger from "../utils/logger";

const socketHandler = (io: Server): void => {
    io.on("connection", (socket: Socket) => {
        logger(`Client connected: ${socket.id}`);

        socket.on("join-room", ({ roomId, userName }) => {
            socket.join(roomId);

            socket.data.userName = userName;

            socket.to(roomId).emit("user-joined", {
                socketId: socket.id,
                userName,
            });

            logger(`${userName} joined room: ${roomId}`);
        });

        socket.on("offer", ({ offer, roomId, userName }) => {
            logger(`Forwarding offer to room: ${roomId}`);

            socket.to(roomId).emit("receive-offer", {
                offer,
                socketId: socket.id,
                userName,
            });
        });

        socket.on("answer", ({ answer, roomId, userName }) => {
            logger(`Forwarding answer to room: ${roomId}`);

            socket.to(roomId).emit("receive-answer", {
                answer,
                socketId: socket.id,
                userName,
            });
        });

        socket.on("raise-hand", ({ roomId, userName }) => {
            console.log(`${userName} raised hand in room ${roomId}`);

            socket.to(roomId).emit("user-raised-hand", {
                userName,
            });

            console.log("RAISE HAND EMITTED TO ROOM:", roomId);
        });

        socket.on("send-message", ({ roomId, message, userName }) => {
            socket.to(roomId).emit("receive-message", {
                message,
                userName,
                time: new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
            });

            console.log(`${userName}: ${message}`);
        });

        socket.on("typing", ({ roomId, userName }) => {
            socket.to(roomId).emit("user-typing", {
                userName,
            });
        });

        socket.on("disconnect", () => {
            logger(`Client disconnected: ${socket.id}`);
        });
    });
};

export default socketHandler;