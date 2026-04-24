import React, { useEffect, useRef } from "react";

type RemoteVideoProps = {
    remoteStream: MediaStream | null;
    remoteUserName?: string;
    roomId?: string;
};

export default function RemoteVideo({
    remoteStream,
    remoteUserName = "Participant",
    roomId,
}: RemoteVideoProps) {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current && remoteStream) {
            videoRef.current.srcObject = remoteStream;
        }
    }, [remoteStream]);

    const hasRemoteVideo =
        remoteStream && remoteStream.getTracks().length > 0;

    return (
        <div className="relative w-full h-screen bg-gradient-to-br from-black via-slate-950 to-sky-950 overflow-hidden">
            <div className="absolute inset-0 p-4 md:p-6">
                <div className="relative w-full h-full rounded-[28px] overflow-hidden border border-sky-400/20 bg-black shadow-2xl">

                    {hasRemoteVideo ? (
                        <>
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                className="w-full h-full object-cover"
                            />

                            {/* Premium overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

                            {/* Remote user badge */}
                            <div className="absolute top-5 right-5 z-20">
                                <div className="px-5 py-2 rounded-2xl bg-black/65 backdrop-blur-md border border-sky-300/20 shadow-lg">
                                    <p className="text-white text-sm md:text-base font-medium tracking-wide">
                                        {remoteUserName}
                                    </p>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-white">
                            <div className="text-center space-y-5">
                                <h1 className="text-3xl md:text-4xl font-bold">
                                    Waiting for Roommate...
                                </h1>

                                <p className="text-gray-300 text-lg">
                                    Please hang on while someone joins your meeting
                                </p>

                                <div className="bg-slate-800 px-6 py-4 rounded-2xl inline-block border border-sky-400/20">
                                    <p className="text-sm text-gray-400 mb-1">
                                        Share this Meeting ID
                                    </p>

                                    <p className="text-xl font-semibold tracking-widest">
                                        {roomId}
                                    </p>
                                </div>

                                <p className="text-sm text-gray-500">
                                    Waiting for participant connection...
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}