"use client";

import { useEffect, useRef, useState } from "react";
import socket from "../../../services/socket";
import useSocket from "../../../hooks/useSocket";
import { useParams } from "next/navigation";
import LocalVideo from "../../../components/LocalVideo";
import { createPeerConnection } from "@/src/services/peer";
import RemoteVideo from "@/src/components/RemoteVideo";
import MeetingControls from "@/src/components/MeetingControls";
import ChatDrawer from "@/src/components/ChatDrawer";

const RoomPage = () => {
    useSocket();

    const params = useParams();
    const roomId = params.roomId as string;
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const peerRef = useRef<RTCPeerConnection | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [localUserName, setLocalUserName] = useState("");
    const [remoteUserName, setRemoteUserName] = useState("");
    const [isMuted, setIsMuted] = useState(false);
    const [isCameraOff, setIsCameraOff] = useState(false);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
    const [handRaisedMessage, setHandRaisedMessage] = useState("");
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<
        {
            userName: string;
            message: string;
            time: string;
        }[]
    >([]);
    const [isTyping, setIsTyping] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const notificationAudioRef = useRef<HTMLAudioElement | null>(null);
    const reactionAudioRef = useRef<HTMLAudioElement | null>(null);
    const [reaction, setReaction] = useState("");

    //Initialize audio for new message notification
    useEffect(() => {
        notificationAudioRef.current = new Audio("/sounds/dragon-studio-notification-sound-effect-372475.mp3");
        reactionAudioRef.current = new Audio("/sounds/soundreality-notification-center-443093.mp3");
    }, []);

    // Setup Peer
    useEffect(() => {
        if (!localStream) return;

        const peer = createPeerConnection();
        peerRef.current = peer;
        // add local tracks to peer connection
        localStream.getTracks().forEach((track) => {
            peer.addTrack(track, localStream);
        });

        // listen for ICE candidates
        peer.onicecandidate = (event) => {
            if (event.candidate) {
                console.log("ICE Candidate:", event.candidate);
            }
        };

        // listen for remote stream
        peer.ontrack = (event) => {
            setRemoteStream(event.streams[0]);
            console.log("Remote track received:", event.streams[0]);
        };

        console.log("Peer connection created");

        return () => {
            peer.close();
        };
    }, [localStream]);

    // socket listeners
    useEffect(() => {
        socket.on("user-joined", async ({ userName }) => {
            if (!peerRef.current) return;
            setRemoteUserName(userName);

            console.log("User joined → creating offer");

            const offer = await peerRef.current.createOffer();
            await peerRef.current.setLocalDescription(offer);

            socket.emit("offer", {
                offer,
                roomId,
                userName: localUserName
            });

            console.log("Offer sent");
        });

        socket.on("receive-offer", async ({ offer, userName }) => {
            if (!peerRef.current) return;

            const remoteName = userName || 'Participant';
            setRemoteUserName(remoteName);

            console.log("Offer received");

            await peerRef.current.setRemoteDescription(
                new RTCSessionDescription(offer)
            );

            const answer = await peerRef.current.createAnswer();
            await peerRef.current.setLocalDescription(answer);

            socket.emit("answer", {
                answer,
                roomId,
                userName: localUserName
            });

            console.log("Answer sent");
        });

        socket.on("receive-answer", async ({ answer, userName }) => {
            if (!peerRef.current) return;

            const remoteName = userName || 'Participant';
            setRemoteUserName(remoteName);

            console.log("Answer received");

            await peerRef.current.setRemoteDescription(
                new RTCSessionDescription(answer)
            );

            console.log("P2P connection established");
        });

        socket.on("user-raised-hand", ({ userName }) => {
            console.log(`${userName} raised hand`);
            setHandRaisedMessage(`${userName} raised hand ✋`);

            setTimeout(() => {
                setHandRaisedMessage("");
            }, 3000);
        });

        socket.on("receive-message", ({ userName, message, time }) => {
            console.log(`Message received from ${userName}: ${message}`);
            setMessages((prev) => [
                ...prev,
                {
                    userName,
                    message,
                    time,
                },
            ]);

            const isMyMessage = userName === localUserName;
            console.log("Is my message?", isMyMessage, "Chat open?", isChatOpen);
            if (!isChatOpen && !isMyMessage) {
                setUnreadCount((prev) => prev + 1);

                if (notificationAudioRef.current) {
                    notificationAudioRef.current.currentTime = 0;

                    notificationAudioRef.current.play().catch((err) => {
                        console.log("Audio play blocked:", err);
                    });
                }
            }
        });

        socket.on("user-typing", ({ userName }) => {
            if (userName !== localUserName) {
                setIsTyping(true);

                setTimeout(() => {
                    setIsTyping(false);
                }, 1500);
            }
        });

        socket.on('receive-reaction', ({ userName, reaction }) => {
            console.log(`${userName} sent reaction: ${reaction}`);
            setReaction(`${userName} reacted with ${reaction}`);

            if (reactionAudioRef.current) {
                reactionAudioRef.current.currentTime = 0;

                reactionAudioRef.current.play().catch((err) => {
                    console.log("Reaction Audio play blocked:", err);
                });
            }

            setTimeout(() => {
                setReaction("");
            }, 3000);
        });

        socket.on("user-left", () => {
            console.log("Remote user left");

            setRemoteStream(null);
            setRemoteUserName("");

            if (peerRef.current) {
                peerRef.current.close();
                peerRef.current = null;
            }
        });

        return () => {
            socket.off("user-joined");
            socket.off("receive-offer");
            socket.off("receive-answer");
            socket.off("user-raised-hand");
            socket.off("receive-message");
            socket.off("user-typing");
            socket.off("receive-reaction");
            socket.off("user-left");
        };
    }, [roomId, localStream, localUserName, isChatOpen, reaction]);

    // Join room
    useEffect(() => {
        if (!roomId || !localStream) return;
        const userName = sessionStorage.getItem("userName") || 'Guest';
        setLocalUserName(userName);

        socket.emit("join-room", {
            roomId,
            userName,
        });

        console.log("Joined room:", roomId);
    }, [roomId, localStream]);

    const toggleMute = () => {
        if (!localStream) return;
        localStream.getAudioTracks().forEach((track) => {
            track.enabled = !track.enabled;
        });
        setIsMuted(!isMuted);
    };

    const toggleCamera = () => {
        if (!localStream) return;
        localStream.getVideoTracks().forEach((track) => {
            track.enabled = !track.enabled;
        });
        setIsCameraOff(!isCameraOff);
    };

    const leaveMeeting = () => {
        if (localStream) {
            localStream.getTracks().forEach((track) => track.stop());
        }
        if (peerRef.current) {
            peerRef.current.close();
        }
        socket.emit("leave-meeting", {
            roomId,
        });
        socket.disconnect();

        window.location.href = "/";
    }

    const stopScreenShare = async () => {
        try {
            if (!localStream || !peerRef.current) return;

            const cameraTrack = localStream.getVideoTracks()[0];

            const sender = peerRef.current
                .getSenders()
                .find((s) => s.track?.kind === "video");

            if (sender && cameraTrack) {
                await sender.replaceTrack(cameraTrack);
            }

            if (screenStream) {
                screenStream.getTracks().forEach((track) => track.stop());
            }

            setScreenStream(null);
            setIsScreenSharing(false);

            console.log("Screen sharing stopped");
        } catch (error) {
            console.error("Stop screen share error:", error);
        }
    };

    const startScreenShare = async () => {
        try {
            const displayStream = await navigator.mediaDevices.getDisplayMedia({
                video: true,
                audio: true,
            });

            const screenTrack = displayStream.getVideoTracks()[0];

            if (!peerRef.current) return;

            const sender = peerRef.current
                .getSenders()
                .find((s) => s.track?.kind === "video");

            if (sender) {
                await sender.replaceTrack(screenTrack);
            }

            setScreenStream(displayStream);
            setIsScreenSharing(true);
            console.log("Screen sharing started");

            // IMPORTANT: when browser stop sharing button clicked
            screenTrack.onended = async () => {
                stopScreenShare();
            };
        } catch (error) {
            console.error("Screen share error:", error);
        }
    }

    const raiseHand = () => {
        socket.emit("raise-hand", {
            roomId,
            userName: localUserName,
        });

        console.log("Hand raised");
    };

    const sendMessage = () => {
        if (!message.trim()) return;

        const newMessage = {
            userName: `You (${localUserName})`,
            message,
            time: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            }),
        };

        setMessages((prev) => [...prev, newMessage]);

        socket.emit("send-message", {
            roomId,
            message,
            userName: localUserName,
        });

        setMessage("");
    };

    const handleTyping = (value: string) => {
        setMessage(value);

        socket.emit("typing", {
            roomId,
            userName: localUserName,
        });
    };

    const sendReaction = (emoji: string) => {
        socket.emit("send-reaction", {
            roomId,
            userName: localUserName,
            reaction: emoji,
        });
        console.log("Reaction sent:", emoji);
    }

    return (
        <div className="w-full h-screen bg-gray-950 flex overflow-hidden">
            {/* Hand Raised Message */}
            {handRaisedMessage && (
                <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[999] bg-white text-black px-6 py-3 rounded-2xl font-semibold shadow-xl">
                    {handRaisedMessage}
                </div>
            )}
            {/* Reaction Popup */}
            {reaction && (
                <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[999] 
                    bg-white text-black px-6 py-3 rounded-2xl font-semibold shadow-xl
                    text-xl animate-bounce">
                    {reaction}
                </div>
            )}

            {/* LEFT SIDE → VIDEO AREA */}
            <div
                className={`relative h-full transition-all duration-300 ${isChatOpen ? "w-[70%]" : "w-full"
                    }`}
            >
                <RemoteVideo
                    remoteStream={remoteStream}
                    remoteUserName={remoteUserName}
                    roomId={roomId}
                />

                <LocalVideo
                    setLocalStream={setLocalStream}
                    userName={`You (${localUserName})`}
                />

                <MeetingControls
                    isMuted={isMuted}
                    isCameraOff={isCameraOff}
                    isScreenSharing={isScreenSharing}
                    isChatOpen={isChatOpen}
                    toggleMic={toggleMute}
                    toggleCamera={toggleCamera}
                    toggleScreenShare={startScreenShare}
                    stopScreenShare={stopScreenShare}
                    toggleChat={() => {
                        setIsChatOpen((prev) => {
                            const nextState = !prev;

                            // when opening chat → clear unread count
                            if (nextState) {
                                setUnreadCount(0);
                            }

                            return nextState;
                        });
                    }}
                    leaveMeeting={leaveMeeting}
                    raiseHand={raiseHand}
                    unreadCount={unreadCount}
                    isChatOpened={isChatOpen}
                    sendReaction={sendReaction}
                />
            </div>

            {/* RIGHT SIDE → CHAT DRAWER */}
            {isChatOpen && (
                <div className="w-[30%] h-full border-l border-slate-800">
                    <ChatDrawer
                        messages={messages}
                        message={message}
                        setMessage={handleTyping}
                        sendMessage={sendMessage}
                        isChatOpen={isChatOpen}
                        isTyping={isTyping}
                        closeChat={() => {
                            setIsChatOpen(false);
                            setUnreadCount(0);
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default RoomPage;