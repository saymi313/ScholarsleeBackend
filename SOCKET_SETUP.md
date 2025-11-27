# Socket.IO Real-Time Messaging Setup

This document explains the Socket.IO implementation for real-time messaging between mentors and mentees.

## Overview

The application now has a complete Socket.IO implementation that enables real-time bidirectional communication between mentors and mentees. The implementation is split between backend (Node.js/Express) and frontend (React).

## Architecture

### Backend Structure

```
Backend/src/shared/
├── config/
│   └── socket.js                 # Socket.IO configuration and initialization
├── models/
│   ├── Message.js                # Message schema
│   └── Conversation.js           # Conversation schema
├── controllers/
│   └── chatController.js         # Chat API endpoints
├── routes/
│   └── chatRoutes.js            # Chat routes
└── services/
    └── socketHandlers.js        # Socket event handlers
```

### Frontend Structure

```
Frontend/src/
├── shared/
│   ├── services/
│   │   └── socketService.js     # Socket service (singleton)
│   └── hooks/
│       ├── useSocket.js         # Socket connection hook
│       └── useChat.js           # Chat management hook
└── context/
    └── AuthContext.jsx          # Auth with socket integration
```

## Features Implemented

### Backend Features

1. **Socket.IO Server**
   - Authentication middleware
   - Connection/disconnection handling
   - User presence tracking
   - Automatic reconnection

2. **Real-Time Events**
   - Message sending/receiving
   - Typing indicators
   - Read receipts
   - Delivery confirmations
   - User online/offline status

3. **API Endpoints**
   - `GET /api/chat/conversations` - Get all conversations
   - `GET /api/chat/conversations/:participantId` - Get/create conversation
   - `GET /api/chat/conversations/:conversationId/messages` - Get messages
   - `POST /api/chat/messages` - Send message
   - `PUT /api/chat/conversations/:conversationId/settings` - Update settings
   - `PUT /api/chat/conversations/:conversationId/read` - Mark as read
   - `DELETE /api/chat/messages/:messageId` - Delete message

4. **Database Models**
   - **Message**: Stores all chat messages with metadata
   - **Conversation**: Manages conversation state and participants

### Frontend Features

1. **Socket Service**
   - Singleton pattern for single socket instance
   - Auto-reconnection logic
   - Event emitter pattern for easy subscription
   - Chat-specific helper methods

2. **React Hooks**
   - `useSocket`: Manages socket connection lifecycle
   - `useSocketEvent`: Subscribe to specific socket events
   - `useChat`: Complete chat management (messages, typing, etc.)

3. **Integration**
   - Auto-connect on login
   - Auto-disconnect on logout
   - Persistent connection across route changes

## Installation & Setup

### 1. Install Dependencies

#### Backend
```bash
cd Backend
npm install socket.io
```

#### Frontend
```bash
cd Frontend
npm install socket.io-client
```

### 2. Environment Variables

No additional environment variables needed. The socket server uses the same port as Express.

### 3. Start the Server

The Socket.IO server is automatically initialized when you start the backend:

```bash
cd Backend
npm run dev
```

You should see:
```
✅ Socket.IO initialized successfully
🚀 Socket.IO initialized successfully
Server running in development mode on port 5000
```

### 4. Start the Frontend

```bash
cd Frontend
npm run dev
```

## Usage in Components

### Basic Socket Connection

```javascript
import { useSocket } from '../shared/hooks/useSocket';
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { user } = useAuth();
  const { socket, connected } = useSocket(localStorage.getItem('token'));

  useEffect(() => {
    if (connected) {
      console.log('Socket connected!');
    }
  }, [connected]);

  return <div>Socket Status: {connected ? 'Connected' : 'Disconnected'}</div>;
}
```

### Using Chat Hook

```javascript
import { useChat } from '../shared/hooks/useChat';

function ChatComponent({ conversationId, participantId }) {
  const {
    messages,
    sendMessage,
    typing,
    loading,
    startTyping,
    stopTyping
  } = useChat(conversationId, participantId);

  const handleSendMessage = (content) => {
    sendMessage(content);
  };

  const handleTyping = () => {
    startTyping();
  };

  return (
    <div>
      {/* Message list */}
      {messages.map(msg => (
        <div key={msg._id}>{msg.content}</div>
      ))}
      
      {/* Typing indicator */}
      {typing && <div>User is typing...</div>}
      
      {/* Input */}
      <input onChange={handleTyping} />
      <button onClick={() => handleSendMessage('Hello')}>Send</button>
    </div>
  );
}
```

### Listening to Custom Events

```javascript
import { useSocketEvent } from '../shared/hooks/useSocket';

function NotificationComponent() {
  useSocketEvent('message:new', (data) => {
    console.log('New message received:', data);
    // Show notification
  });

  useSocketEvent('user:online', (data) => {
    console.log('User came online:', data.userId);
  });

  return <div>Notifications</div>;
}
```

## Socket Events

### Client → Server

- `message:send` - Send a message
- `typing:start` - User started typing
- `typing:stop` - User stopped typing
- `conversation:join` - Join a conversation room
- `conversation:leave` - Leave a conversation room
- `message:delivered` - Mark message as delivered
- `message:read` - Mark message as read
- `user:status` - Update user status

### Server → Client

- `message:new` - New message received
- `message:sent` - Message sent confirmation
- `message:status` - Message status update (delivered/read)
- `message:deleted` - Message was deleted
- `typing:start` - Other user started typing
- `typing:stop` - Other user stopped typing
- `messages:read` - Messages were read by other user
- `conversation:updated` - Conversation was updated
- `user:online` - User came online
- `user:offline` - User went offline
- `user:status:changed` - User status changed

## Security

1. **Authentication**: JWT token required for socket connection
2. **Authorization**: Users can only access their own conversations
3. **Validation**: All socket events validate user permissions
4. **Rate Limiting**: Consider adding rate limiting in production

## Troubleshooting

### Socket Won't Connect

1. Check if backend server is running
2. Verify token is valid
3. Check browser console for errors
4. Ensure CORS is configured correctly

### Messages Not Delivering

1. Check socket connection status
2. Verify conversation exists
3. Check browser network tab for API errors
4. Review backend console logs

### Typing Indicators Not Working

1. Ensure both users are online
2. Check socket event subscriptions
3. Verify conversation IDs match

## Next Steps

To complete the implementation:

1. **Integrate into Mentee Chat Components** - Update the existing chat UI to use the new hooks
2. **Create Mentor Chat Page** - Build a similar chat interface for mentors
3. **Add File Sharing** - Implement file upload for images/documents
4. **Add Voice Messages** - Implement audio recording and playback
5. **Add Video Calls** - Integrate WebRTC for video calls
6. **Add Push Notifications** - Notify users of new messages when offline

## API Examples

### Get Conversations
```javascript
const response = await axios.get('/api/chat/conversations', {
  headers: { Authorization: `Bearer ${token}` }
});
```

### Send Message
```javascript
const response = await axios.post('/api/chat/messages', {
  conversationId: 'conv_id',
  content: 'Hello!',
  messageType: 'text'
}, {
  headers: { Authorization: `Bearer ${token}` }
});
```

### Get Messages
```javascript
const response = await axios.get('/api/chat/conversations/conv_id/messages?page=1&limit=50', {
  headers: { Authorization: `Bearer ${token}` }
});
```

## Performance Considerations

1. **Message Pagination**: Messages are paginated (50 per page)
2. **Lazy Loading**: Load older messages on scroll
3. **Optimistic Updates**: UI updates before server confirmation
4. **Connection Pooling**: Single socket connection reused
5. **Event Debouncing**: Typing events are debounced

## Testing

### Manual Testing

1. Open two browser windows (or incognito)
2. Login as mentor in one, mentee in another
3. Start a conversation
4. Test:
   - Sending messages
   - Typing indicators
   - Read receipts
   - Online/offline status
   - Reconnection after network interruption

### Automated Testing

Consider adding:
- Socket.IO client tests
- Integration tests for chat flow
- Load testing for concurrent connections

## Support

For issues or questions:
1. Check the backend console logs
2. Check the browser console
3. Review the Socket.IO documentation: https://socket.io/docs/v4/
4. Check this setup guide

---

**Status**: Backend infrastructure complete ✅  
**Next**: Integrate into UI components

