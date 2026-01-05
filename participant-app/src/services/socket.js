import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'https://interactivequiz-webapp-backend.24livehost.com';

class SocketService {
    constructor() {
        this.socket = null;
        this.listeners = new Map();
    }

    /**
     * Connect to WebSocket server
     */
    connect() {
        if (this.socket?.connected) {
            return this.socket;
        }

        this.socket = io(SOCKET_URL, {
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: 10,
            timeout: 20000
        });

        this.setupBaseListeners();
        return this.socket;
    }

    /**
     * Setup base connection listeners
     */
    setupBaseListeners() {
        this.socket.on('connect', () => {
            console.log('✅ Connected to server');
            this.notifyListeners('connection_status', { status: 'connected' });
        });

        this.socket.on('disconnect', () => {
            console.log('❌ Disconnected from server');
            this.notifyListeners('connection_status', { status: 'disconnected' });
        });

        this.socket.on('reconnecting', (attemptNumber) => {
            console.log(`🔄 Reconnecting... (attempt ${attemptNumber})`);
            this.notifyListeners('connection_status', {
                status: 'reconnecting',
                attempt: attemptNumber
            });
        });

        this.socket.on('connect_error', (error) => {
            console.error('Connection error:', error);
            this.notifyListeners('connection_status', {
                status: 'error',
                error: error.message
            });
        });
    }

    /**
     * Emit event to server
     */
    emit(event, data) {
        if (!this.socket?.connected) {
            console.warn('Socket not connected, queueing event:', event);
            return;
        }
        this.socket.emit(event, data);
    }

    /**
     * Listen to server events
     */
    on(event, callback) {
        if (!this.socket) return;

        // Store listener for cleanup
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);

        this.socket.on(event, callback);
    }

    /**
     * Remove event listener
     */
    off(event, callback) {
        if (!this.socket) return;
        this.socket.off(event, callback);

        // Remove from stored listeners
        const eventListeners = this.listeners.get(event);
        if (eventListeners) {
            const index = eventListeners.indexOf(callback);
            if (index > -1) {
                eventListeners.splice(index, 1);
            }
        }
    }

    /**
     * Notify all listeners for an event
     */
    notifyListeners(event, data) {
        const eventListeners = this.listeners.get(event);
        if (eventListeners) {
            eventListeners.forEach(callback => callback(data));
        }
    }

    /**
     * Disconnect socket
     */
    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    /**
     * Get connection status
     */
    isConnected() {
        return this.socket?.connected || false;
    }
}

// Singleton instance
const socketService = new SocketService();

export default socketService;
