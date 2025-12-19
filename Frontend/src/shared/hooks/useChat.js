import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import socketService from '../services/socketService';
import { chatAPI } from '../api/chatAPI';
import { useAuth } from '../../context/AuthContext';

export const useChat = (conversationId, participantId) => {
  const { user } = useAuth();
  
  // Get current user ID for optimistic messages
  const currentUserId = useMemo(() => {
    const id = user?._id || user?.id;
    return id ? id.toString() : '';
  }, [user?._id, user?.id]);
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [typing, setTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const typingTimeoutRef = useRef(null);
  const fetchConversationsRef = useRef(null);

  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await chatAPI.getConversations();
      if (response.data.success) {
        setConversations(response.data.data.conversations);
      } else {
        setError(response.data.message || 'Failed to fetch conversations');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch conversations';
      console.error('Error fetching conversations:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Store the latest fetchConversations in a ref
  fetchConversationsRef.current = fetchConversations;

  // Fetch messages
  const fetchMessages = useCallback(async (convId) => {
    if (!convId) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await chatAPI.getMessages(convId);
      if (response.data.success) {
        // Deduplicate messages by ID
        const messageMap = new Map();
        response.data.data.messages.forEach(msg => {
          const msgId = msg._id?.toString() || msg.id?.toString();
          if (msgId && !messageMap.has(msgId)) {
            messageMap.set(msgId, msg);
          }
        });
        setMessages(Array.from(messageMap.values()));
      } else {
        setError(response.data.message || 'Failed to fetch messages');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch messages';
      console.error('Error fetching messages:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Send message via API
  const sendMessage = useCallback(async (content, messageType = 'text', replyTo = null) => {
    if (!conversationId || !content?.trim()) {
      setError('Conversation ID and message content are required');
      return;
    }

    try {
      const tempId = `temp_${Date.now()}`;
      setError(null);
      
      // Optimistic update - use actual currentUserId to match server response format
      const optimisticMessage = {
        _id: tempId,
        content,
        messageType,
        sender: currentUserId, // Use actual user ID instead of 'me'
        createdAt: new Date(),
        isRead: false,
        isDelivered: false,
        replyTo
      };
      
      setMessages(prev => {
        // Prevent duplicate optimistic messages
        const exists = prev.some(msg => msg._id === tempId);
        return exists ? prev : [...prev, optimisticMessage];
      });

      // Send via API (backend will handle socket emission)
      const response = await chatAPI.sendMessage({
        conversationId,
        content,
        messageType,
        replyTo
      });

      if (response.data.success) {
        // Replace optimistic message with real one
        setMessages(prev => {
          const messageMap = new Map();
          prev.forEach(msg => {
            const msgId = msg._id?.toString();
            if (msgId === tempId) {
              // Replace with real message
              const realMsg = response.data.data.message;
              messageMap.set(realMsg._id.toString(), realMsg);
            } else if (msgId) {
              messageMap.set(msgId, msg);
            }
          });
          return Array.from(messageMap.values());
        });
        
        // Update conversation list with new lastMessage
        setConversations(prev => 
          prev.map(conv =>
            conv.conversationId === conversationId
              ? {
                  ...conv,
                  lastMessage: {
                    content,
                    sender: response.data.data.message.sender,
                    timestamp: new Date(),
                    messageType
                  },
                  unreadCount: 0 // Reset unread when sending
                }
              : conv
          )
        );
      } else {
        throw new Error(response.data.message || 'Failed to send message');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to send message';
      console.error('Error sending message:', errorMessage);
      setError(errorMessage);
      // Remove optimistic message on error
      setMessages(prev => prev.filter(msg => msg._id !== tempId));
    }
  }, [conversationId, currentUserId]);

  // Delete message
  const deleteMessage = useCallback(async (messageId, deleteForEveryone = false) => {
    if (!messageId) return;
    
    try {
      setError(null);
      await chatAPI.deleteMessage(messageId, deleteForEveryone);
      setMessages(prev => prev.filter(msg => {
        const msgId = msg._id?.toString() || msg.id?.toString();
        return msgId !== messageId.toString();
      }));
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete message';
      console.error('Error deleting message:', errorMessage);
      setError(errorMessage);
    }
  }, []);

  // Start typing indicator
  const startTyping = useCallback(() => {
    if (!conversationId || !participantId) return;
    
    socketService.startTyping(conversationId, participantId);
    
    // Auto-stop after 3 seconds
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      socketService.stopTyping(conversationId, participantId);
    }, 3000);
  }, [conversationId, participantId]);

  // Stop typing indicator
  const stopTyping = useCallback(() => {
    if (!conversationId || !participantId) return;
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    socketService.stopTyping(conversationId, participantId);
  }, [conversationId, participantId]);

  // Mark messages as read
  const markAsRead = useCallback(async () => {
    if (!conversationId) return;
    
    try {
      await chatAPI.markAsRead(conversationId);
      // Update local state
      setMessages(prev => prev.map(msg => ({ ...msg, isRead: true })));
      setConversations(prev => 
        prev.map(conv =>
          conv.conversationId === conversationId
            ? { ...conv, unreadCount: 0 }
            : conv
        )
      );
    } catch (err) {
      console.error('Error marking as read:', err);
      // Don't set error for read receipts - it's not critical
    }
  }, [conversationId]);

  // Update conversation settings
  const updateConversationSettings = useCallback(async (settings) => {
    if (!conversationId) return;
    
    try {
      setError(null);
      await chatAPI.updateSettings(conversationId, settings);
      
      // Update local state
      setConversations(prev =>
        prev.map(conv =>
          conv.conversationId === conversationId
            ? { ...conv, ...settings }
            : conv
        )
      );
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update settings';
      console.error('Error updating conversation settings:', errorMessage);
      setError(errorMessage);
    }
  }, [conversationId]);

  // Socket event listeners
  useEffect(() => {
    // New message received - centralized duplicate prevention
    const onNewMessage = (data) => {
      if (!data?.message || !data?.conversation) return;
      
      const incomingConvId = data.conversation.conversationId;
      const messageId = data.message._id?.toString() || data.message.id?.toString();
      
      // If this conversation is currently open, add message to messages array
      if (conversationId && incomingConvId === conversationId) {
        // Centralized duplicate prevention using Set
        setMessages(prev => {
          const messageMap = new Map();
          prev.forEach(msg => {
            const msgId = msg._id?.toString() || msg.id?.toString();
            if (msgId) messageMap.set(msgId, msg);
          });
          
          // Add new message if not duplicate
          if (messageId && !messageMap.has(messageId)) {
            messageMap.set(messageId, data.message);
          }
          
          return Array.from(messageMap.values());
        });
        markAsRead();
      }
      
      // Always update conversation list (whether chat is open or not)
      setConversations(prev => {
        if (!prev || prev.length === 0) {
          // Fetch conversations if list is empty
          if (fetchConversationsRef.current) {
            fetchConversationsRef.current();
          }
          return prev;
        }
        
        const exists = prev.some(conv => conv.conversationId === incomingConvId);
        
        if (!exists) {
          // New conversation - fetch full list to get complete data
          if (fetchConversationsRef.current) {
            fetchConversationsRef.current();
          }
          return prev;
        }
        
        // Update existing conversation efficiently
        return prev.map(conv =>
          conv.conversationId === incomingConvId
            ? { 
                ...conv, 
                lastMessage: data.conversation.lastMessage, 
                unreadCount: conv.conversationId === conversationId ? (conv.unreadCount || 0) : (conv.unreadCount || 0) + 1 
              }
            : conv
        );
      });
    };

    // Message sent confirmation
    const onMessageSent = (data) => {
      setMessages(prev =>
        prev.map(msg =>
          msg._id === data.tempId ? data.message : msg
        )
      );
    };

    // Message status update (delivered/read)
    const onMessageStatus = (data) => {
      if (!data?.messageId || !data?.status) return;
      
      setMessages(prev =>
        prev.map(msg => {
          const msgId = msg._id?.toString() || msg.id?.toString();
          if (msgId === data.messageId.toString()) {
            const statusKey = data.status === 'delivered' ? 'isDelivered' : 
                            data.status === 'read' ? 'isRead' : null;
            if (statusKey) {
              return { ...msg, [statusKey]: true };
            }
          }
          return msg;
        })
      );
    };

    // Messages read (when other user opens chat)
    const onMessagesRead = (data) => {
      if (!data?.conversationId) return;
      
      if (data.conversationId === conversationId) {
        // Mark all messages in this conversation as read
        setMessages(prev => prev.map(msg => ({
          ...msg,
          isRead: true,
          readAt: new Date()
        })));
      }
    };

    // Typing indicators
    const onTypingStart = (data) => {
      if (data.conversationId === conversationId) {
        setTyping(true);
      }
    };

    const onTypingStop = (data) => {
      if (data.conversationId === conversationId) {
        setTyping(false);
      }
    };

    // User online/offline
    const onUserOnline = (data) => {
      setOnlineUsers(prev => new Set([...prev, data.userId]));
    };

    const onUserOffline = (data) => {
      setOnlineUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(data.userId);
        return newSet;
      });
    };

    // Subscribe to events
    const unsubNewMessage = socketService.on('message:new', onNewMessage);
    const unsubMessageSent = socketService.on('message:sent', onMessageSent);
    const unsubMessageStatus = socketService.on('message:status', onMessageStatus);
    const unsubMessagesRead = socketService.on('messages:read', onMessagesRead);
    const unsubTypingStart = socketService.on('typing:start', onTypingStart);
    const unsubTypingStop = socketService.on('typing:stop', onTypingStop);
    const unsubUserOnline = socketService.on('user:online', onUserOnline);
    const unsubUserOffline = socketService.on('user:offline', onUserOffline);

    return () => {
      unsubNewMessage();
      unsubMessageSent();
      unsubMessageStatus();
      unsubMessagesRead();
      unsubTypingStart();
      unsubTypingStop();
      unsubUserOnline();
      unsubUserOffline();
    };
  }, [conversationId, markAsRead]);

  return {
    messages,
    conversations,
    loading,
    error,
    typing,
    typingUsers: typing ? [participantId] : [], // For backward compatibility
    onlineUsers: Array.from(onlineUsers),
    sendMessage,
    deleteMessage,
    startTyping,
    stopTyping,
    emitTyping: startTyping, // Alias for backward compatibility
    markAsRead,
    fetchMessages,
    fetchConversations,
    updateConversationSettings
  };
};

export default useChat;

