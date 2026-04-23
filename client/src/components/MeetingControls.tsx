"use client";
import {
    Mic,
    MicOff,
    Video,
    VideoOff,
    PhoneOff,
    MonitorUp,
    MonitorOff,
    Hand,
    MessageSquare
} from "lucide-react";

type Props = {
    isMuted: boolean;
    isCameraOff: boolean;
    isScreenSharing: boolean;
    isChatOpened: boolean;
    toggleMic: () => void;
    toggleCamera: () => void;
    toggleScreenShare: () => void;
    stopScreenShare: () => void;
    leaveMeeting: () => void;
    raiseHand: () => void;
    toggleChat: () => void;
    unreadCount?: number;
};

const MeetingControls = ({
    isMuted,
    isCameraOff,
    isScreenSharing,
    isChatOpened,
    toggleMic,
    toggleCamera,
    toggleScreenShare,
    stopScreenShare,
    leaveMeeting,
    raiseHand,
    toggleChat,
    unreadCount = 0,
}: Props) => {
    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
            <div className="flex items-center gap-4 px-6 py-4 rounded-3xl bg-black/70 backdrop-blur-xl border border-sky-400/20 shadow-2xl">

                <button
                    onClick={toggleMic}
                    className="px-5 py-3 rounded-2xl bg-slate-800 text-white hover:bg-slate-700 transition"
                >
                    {isMuted ? (
                        <MicOff className="text-white" size={22} />
                    ) : (
                        <Mic className="text-white" size={22} />
                    )}
                </button>

                <button
                    onClick={toggleCamera}
                    className="px-5 py-3 rounded-2xl bg-slate-800 text-white hover:bg-slate-700 transition"
                >
                    {isCameraOff ? (
                        <VideoOff className="text-white" size={22} />
                    ) : (
                        <Video className="text-white" size={22} />
                    )}

                </button>

                {/* Screen Share */}
                <button
                    onClick={
                        isScreenSharing
                            ? stopScreenShare
                            : toggleScreenShare
                    }
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition ${isScreenSharing
                        ? "bg-sky-500 hover:bg-sky-600"
                        : "bg-slate-800 hover:bg-slate-700"
                        }`}
                >
                    {isScreenSharing ? (
                        <MonitorOff className="text-white" size={22} />
                    ) : (
                        <MonitorUp className="text-white" size={22} />
                    )}
                </button>

                <button
                    onClick={raiseHand}
                    className="w-14 h-14 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition"
                    title="Raise Hand"
                >
                    <Hand className="text-white" size={22} />
                </button>

                <div className="relative" onClick={toggleChat}>
                    <MessageSquare className="text-white" size={22} />
                    {unreadCount > 0 && !isChatOpened && (
                        <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full px-2 py-0.5">
                            {unreadCount}
                        </span>
                    )}
                </div>

                <button
                    onClick={leaveMeeting}
                    className="px-5 py-3 rounded-2xl bg-red-600 text-white hover:bg-red-500 transition"
                >
                    <PhoneOff className="text-white" size={24} />

                </button>

            </div>
        </div>
    );
};

export default MeetingControls;