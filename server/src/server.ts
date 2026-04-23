import dotenv from "dotenv";
dotenv.config();

import http from "http";
import { Server } from "socket.io";

import socketHandler from "./socket/socketHandler";
import corsOptions from "./config/cors";
import app from "./app";

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: corsOptions,
});

socketHandler(io);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});