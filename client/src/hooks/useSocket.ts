'use client';

import { useEffect } from "react";
import  socket  from "../services/socket";

const useSocket = () => {
    useEffect(() => {
        socket.connect();

        socket.on("connect", () => {
            console.log("Connected to server:", socket.id);
        });

        socket.on("disconnect", () => {
            console.log("Disconnected from server");
        });

        return () => {
            socket.disconnect();
        };
    }, []);
};

export default useSocket;