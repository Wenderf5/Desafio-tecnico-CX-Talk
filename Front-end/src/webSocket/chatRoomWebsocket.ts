import { io } from "socket.io-client";

export const chatRoomWebsocket = io('http://localhost:8080', {
    path: '/chat'
});