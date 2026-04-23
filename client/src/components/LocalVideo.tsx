"use client";

import { useEffect, useRef } from "react";

interface LocalVideoProps {
    setLocalStream: (stream: MediaStream) => void;
    userName?: string;
}

const LocalVideo = ({
    setLocalStream,
    userName = "You",
}: LocalVideoProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const startVideo = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true,
                });

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }

                setLocalStream(stream);

                console.log("Local media stream started");
            } catch (error) {
                console.error("Camera access error:", error);
            }
        };

        startVideo();
    }, [setLocalStream]);

    return (
        <div className="absolute bottom-6 right-6 w-72 h-52 rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-black z-50">
            <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
            />

            <div className="absolute top-3 right-3 bg-black/70 text-white px-3 py-1 rounded-lg text-xs font-medium">
                {userName}
            </div>
        </div>
    );
};

export default LocalVideo;