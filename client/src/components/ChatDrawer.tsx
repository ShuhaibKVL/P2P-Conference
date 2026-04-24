"use client";

import { X } from "lucide-react";
import TypingIndicator from "./TypingIndicator";

type MessageType = {
    userName: string;
    message: string;
    time: string;
};

type Props = {
    isChatOpen: boolean;
    isTyping: boolean;
    messages: MessageType[];
    message: string;
    setMessage: (value: string) => void;
    sendMessage: () => void;
    closeChat: () => void;
};

const ChatDrawer = ({
    isChatOpen,
    isTyping,
    messages,
    message,
    setMessage,
    sendMessage,
    closeChat,
}: Props) => {
    if (!isChatOpen) return null;

    return (
        <div className="w-full h-full bg-black/90 border-l border-sky-400/20 backdrop-blur-xl z-50 flex flex-col">

            <div className="flex items-center justify-between p-4 border-b border-slate-800">
                <h2 className="text-white text-xl font-semibold">
                    Live Chat
                </h2>

                <button onClick={closeChat}>
                    <X className="text-white" size={22} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className="bg-slate-800 rounded-2xl p-4"
                    >
                        <div className="flex justify-between mb-2">
                            <span className="text-sky-300 font-medium">
                                {msg.userName}
                            </span>

                            <span className="text-gray-400 text-sm">
                                {msg.time}
                            </span>
                        </div>

                        <p className="text-white">
                            {msg.message}
                        </p>
                    </div>
                ))}

                {isTyping && (
                    <TypingIndicator />
                )}
            </div>

            <div className="p-4 border-t border-sky-400/20 flex gap-3">
                <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-slate-800 text-white px-4 py-3 rounded-xl outline-none"
                />

                <button
                    onClick={sendMessage}
                    className="px-5 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatDrawer;