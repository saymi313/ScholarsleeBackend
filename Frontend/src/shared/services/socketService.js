import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
    this.listeners = new Map();
  }

  connect(token) {
    // Always disconnect existing socket first to prevent duplicate connections
    if (this.socket) {
      console.log('Cleaning up existing socket...');
      this.disconnect();
    }

    if (!token) {
      console.error('Cannot connect socket: No token provided');
      return null;
    }

    console.log('Creating new socket connection...');
    // const serverUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    // const serverUrl = 'https://api.scholarslee.com';
    const serverUrl = 'http://localhost:5000';

    this.socket = io(serverUrl, {
      auth: {
        token
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      transports: ['websocket', 'polling'],
      autoConnect: true
    });

    // Connection event handlers
    this.socket.on('connect', () => {
      console.log('✅ Socket connected:', this.socket.id);
      this.connected = true;
      this.emit('socket:connected', { socketId: this.socket.id });
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
      this.connected = false;
      this.emit('socket:disconnected', { reason });
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.emit('socket:error', { error: error.message });
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log('🔄 Socket reconnected after', attemptNumber, 'attempts');
      this.emit('socket:reconnected', { attemptNumber });
    });

    this.socket.on('reconnect_attempt', (attemptNumber) => {
      console.log('🔄 Socket reconnection attempt:', attemptNumber);
    });

    this.socket.on('reconnect_failed', () => {
      console.error('❌ Socket reconnection failed');
      this.emit('socket:reconnect_failed');
    });

    // User presence events
    this.socket.on('user:online', (data) => {
      this.emit('user:online', data);
    });

    this.socket.on('user:offline', (data) => {
      this.emit('user:offline', data);
    });

    this.socket.on('user:status:changed', (data) => {
      this.emit('user:status:changed', data);
    });

    // Message events
    this.socket.on('message:new', (data) => {
      this.emit('message:new', data);
    });

    this.socket.on('message:sent', (data) => {
      this.emit('message:sent', data);
    });

    this.socket.on('message:status', (data) => {
      this.emit('message:status', data);
    });

    this.socket.on('message:deleted', (data) => {
      this.emit('message:deleted', data);
    });

    // Typing events
    this.socket.on('typing:start', (data) => {
      this.emit('typing:start', data);
    });

    this.socket.on('typing:stop', (data) => {
      this.emit('typing:stop', data);
    });

    // Read receipts
    this.socket.on('messages:read', (data) => {
      this.emit('messages:read', data);
    });

    // Conversation events
    this.socket.on('conversation:updated', (data) => {
      this.emit('conversation:updated', data);
    });

    // Error handling
    this.socket.on('error', (data) => {
      console.error('Socket error:', data);
      this.emit('socket:server:error', data);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      console.log('Disconnecting socket...');
      // Remove all event listeners before disconnecting
      this.socket.removeAllListeners();
      // Disable reconnection and force disconnect
      this.socket.io.reconnection(false);
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
      this.listeners.clear();
    }
  }

  // Event emitter pattern
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);

    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(event);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    };
  }

  off(event, callback) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  // Socket-specific emit (to server)
  send(event, data) {
    if (this.socket && this.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn('Socket not connected. Cannot send event:', event);
    }
  }

  // Chat-specific methods
  sendMessage(data) {
    this.send('message:send', data);
  }

  startTyping(conversationId, receiverId) {
    this.send('typing:start', { conversationId, receiverId });
  }

  stopTyping(conversationId, receiverId) {
    this.send('typing:stop', { conversationId, receiverId });
  }

  markMessageDelivered(messageId, conversationId) {
    this.send('message:delivered', { messageId, conversationId });
  }

  markMessageRead(messageId, conversationId) {
    this.send('message:read', { messageId, conversationId });
  }

  updateUserStatus(status) {
    this.send('user:status', { status });
  }

  // Getters
  isConnected() {
    return this.connected && this.socket?.connected;
  }

  getSocket() {
    return this.socket;
  }
}

// Export singleton instance
const socketService = new SocketService();
export default socketService;

