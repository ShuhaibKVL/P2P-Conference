export interface RoomUser {
    socketId: string;
    username: string;
}

export interface Room {
    [roomId: string]: RoomUser[];
}