import { io, Socket } from "socket.io-client";

const SOCKET_URL = "http://172.16.10.92:5000" //'http://localhost:5000';

const socket: Socket = io(SOCKET_URL, {
    autoConnect: false,
    transports: ['websocket']
})

export default socket;