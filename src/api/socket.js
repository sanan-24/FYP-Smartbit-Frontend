import { io } from "socket.io-client";

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "http://localhost:5000";

class SocketService {
    constructor() {
        this.socket = null;
    }

    connect(userId) {
        if (this.socket && this.socket.connected) {
            console.log("Socket already connected, skipping...");
            return;
        }

        if (!this.socket) {
            console.log("Attempting to connect to socket at:", SOCKET_URL);
            this.socket = io(SOCKET_URL, {
                withCredentials: true,
                transports: ["polling", "websocket"],
                reconnection: true,
                reconnectionAttempts: Infinity,
                reconnectionDelay: 1000,
            });

            this.socket.on("connect", () => {
                console.log("✅ Connected to Socket server:", this.socket.id);
                if (userId) {
                    this.socket.emit("join", userId);
                }
            });

            this.socket.on("connect_error", (error) => {
                console.error("❌ Socket Connection Error:", error);
            });

            this.socket.on("disconnect", (reason) => {
                console.log("⚠️ Disconnected from Socket server:", reason);
                // If the server disconnected us, we don't need to do anything, 
                // socket.io-client will try to reconnect automatically
            });
        } else {
            this.socket.connect();
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    on(event, callback) {
        if (this.socket) {
            this.socket.on(event, callback);
        }
    }

    off(event) {
        if (this.socket) {
            this.socket.off(event);
        }
    }

    emit(event, data) {
        if (this.socket) {
            this.socket.emit(event, data);
        }
    }
}

const socketInstance = new SocketService();
export default socketInstance;
