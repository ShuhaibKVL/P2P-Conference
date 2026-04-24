"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { motion } from "framer-motion";
import { Video, Users, Plus, ArrowRight } from "lucide-react";

const RoomJoin = () => {
    const router = useRouter();

    const [name, setName] = useState("");
    const [roomId, setRoomId] = useState("");

    const generateRoomId = () => {
        return uuidv4();
    };

    const handleCreateMeeting = () => {
        if (!name.trim()) {
            alert("Please enter your name");
            return;
        }

        const newRoomId = generateRoomId();
        sessionStorage.setItem("userName", name);
        router.push(`/room/${newRoomId}`);
    };

    const handleJoinMeeting = () => {
        if (!name.trim() || !roomId.trim()) {
            alert("Please fill all fields");
            return;
        }

        sessionStorage.setItem("userName", name);
        router.push(`/room/${roomId}`);
    };

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-black via-slate-950 to-sky-950 flex items-center justify-center px-6 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-[-120px] left-[-120px] w-[420px] h-[420px] rounded-full bg-sky-500/10 blur-3xl" />
            <div className="absolute bottom-[-140px] right-[-100px] w-[460px] h-[460px] rounded-full bg-cyan-400/10 blur-3xl" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 w-full max-w-2xl"
            >
                <div className="rounded-[32px] border border-sky-400/20 bg-white/5 backdrop-blur-2xl shadow-2xl p-8 md:p-10">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-sky-400/20 bg-black/30 mb-5">
                            <Video size={18} className="text-sky-300" />
                            <span className="text-sky-200 text-sm font-medium">
                                P2P Video Conference
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                            Start Your
                            <span className="block bg-gradient-to-r from-sky-300 to-cyan-200 bg-clip-text text-transparent">
                                Smart Meeting
                            </span>
                        </h1>

                        <p className="text-slate-300 mt-4 text-base md:text-lg max-w-xl mx-auto">
                            Create a private room, invite your teammate, and start
                            your real-time video meeting instantly.
                        </p>
                    </div>

                    {/* Name Input */}
                    <div className="space-y-5">
                        <input
                            type="text"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-slate-900/70 border border-slate-700 text-white px-5 py-4 rounded-2xl outline-none focus:border-sky-400 transition"
                        />

                        {/* Create Meeting */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleCreateMeeting}
                            className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-semibold shadow-lg transition"
                        >
                            <Plus size={20} />
                            Create New Meeting
                        </motion.button>

                        <div className="relative py-2">
                            <div className="border-t border-slate-700" />
                            <span className="absolute left-1/2 -translate-x-1/2 -top-1 bg-slate-950 px-4 text-slate-400 text-sm">
                                OR JOIN EXISTING
                            </span>
                        </div>

                        {/* Join Existing */}
                        <input
                            type="text"
                            placeholder="Enter Room ID"
                            value={roomId}
                            onChange={(e) => setRoomId(e.target.value)}
                            className="w-full bg-slate-900/70 border border-slate-700 text-white px-5 py-4 rounded-2xl outline-none focus:border-sky-400 transition"
                        />

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleJoinMeeting}
                            className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-sky-400/20 text-white font-semibold transition"
                        >
                            <Users size={20} />
                            Join with Room ID
                            <ArrowRight size={18} />
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default RoomJoin;
