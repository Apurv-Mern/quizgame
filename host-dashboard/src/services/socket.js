import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'https://interactivequiz-webapp-backend.24livehost.com';

class SocketService {
    constructor() {
        this.socket = null;
        this.listeners = new Map();
    }

    connect() {
        if (this.socket?.connected) return this.socket;

        this.socket = io(SOCKET_URL, {
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 10
        });

        this.setupBaseListeners();

        // Identify as host
        this.socket.on('connect', () => {
            this.socket.emit('join_as_host');
        });

        return this.socket;
    }

    setupBaseListeners() {
        this.socket.on('connect', () => {
            console.log('✅ Host connected');
            this.notifyListeners('connection_status', { status: 'connected' });
        });

        this.socket.on('disconnect', () => {
            console.log('❌ Host disconnected');
            this.notifyListeners('connection_status', { status: 'disconnected' });
        });
    }

    emit(event, data) {
        if (!this.socket?.connected) {
            console.warn('Socket not connected');
            return;
        }
        this.socket.emit(event, data);
    }

    on(event, callback) {
        if (!this.socket) return;

        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);

        this.socket.on(event, callback);
    }

    off(event, callback) {
        if (!this.socket) return;
        this.socket.off(event, callback);

        const eventListeners = this.listeners.get(event);
        if (eventListeners) {
            const index = eventListeners.indexOf(callback);
            if (index > -1) {
                eventListeners.splice(index, 1);
            }
        }
    }

    notifyListeners(event, data) {
        const eventListeners = this.listeners.get(event);
        if (eventListeners) {
            eventListeners.forEach(callback => callback(data));
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    isConnected() {
        return this.socket?.connected || false;
    }
}

const socketService = new SocketService();
export default socketService;
