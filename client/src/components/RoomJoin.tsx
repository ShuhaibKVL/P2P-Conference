"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

const RoomJoin = () => {
    const router = useRouter();

    const [name, setName] = useState("");
    const [roomId, setRoomId] = useState("");

    const generateRoomId = () => {
        return uuidv4();
    };

    const handleCreateMeeting = () => {
        if (!name) {
            alert("Please enter your name");
            return;
        }

        const newRoomId = generateRoomId();

        sessionStorage.setItem("userName", name);

        router.push(`/room/${newRoomId}`);
    };

    const handleJoinMeeting = () => {
        if (!name || !roomId) {
            alert("Please fill all fields");
            return;
        }

        sessionStorage.setItem("userName", name);

        router.push(`/room/${roomId}`);
    };

    return (
        <div className="flex flex-col gap-4 max-w-md mx-auto mt-20">
            <input
                type="text"
                placeholder="Enter your name"
                className="border p-3 rounded"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <button
                onClick={handleCreateMeeting}
                className="bg-blue-600 text-white p-3 rounded"
            >
                Create New Meeting
            </button>

            <div className="text-center font-medium">
                OR
            </div>

            <input
                type="text"
                placeholder="Enter Room ID"
                className="border p-3 rounded"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
            />

            <button
                onClick={handleJoinMeeting}
                className="bg-black text-white p-3 rounded"
            >
                Join Existing Meeting
            </button>
        </div>
    );
};

export default RoomJoin;