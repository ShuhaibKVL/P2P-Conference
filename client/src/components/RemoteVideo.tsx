import React, { useEffect, useRef } from "react";

type RemoteVideoProps = {
    remoteStream: MediaStream | null;
    remoteUserName?: string;
};

export default function RemoteVideo({
    remoteStream,
    remoteUserName = "Participant",
}: RemoteVideoProps) {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current && remoteStream) {
            videoRef.current.srcObject = remoteStream;
        }
    }, [remoteStream]);

    return (
        <div className="relative w-full h-screen bg-gradient-to-br from-black via-slate-950 to-sky-950 overflow-hidden">
            {/* Main Remote Video Container */}
            <div className="absolute inset-0 p-4 md:p-6">
                <div className="relative w-full h-full rounded-[28px] overflow-hidden border border-sky-400/20 bg-black shadow-2xl">
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover"
                    />

                    {/* Soft overlay for premium look */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

                    {/* Remote user badge */}
                    <div className="absolute top-5 right-5 z-20">
                        <div className="px-5 py-2 rounded-2xl bg-black/65 backdrop-blur-md border border-sky-300/20 shadow-lg">
                            <p className="text-white text-sm md:text-base font-medium tracking-wide">
                                {remoteUserName}
                            </p>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    );
}
