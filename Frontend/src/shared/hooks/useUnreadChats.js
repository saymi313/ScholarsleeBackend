import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import socketService from '../services/socketService';
import { chatAPI } from '../api/chatAPI';
import { useAuth } from '../../context/AuthContext';

/**
 * Lightweight hook for tracking unread chat conversations globally.
 * Unlike useChat (which manages messages, typing, etc. for a specific conversation),
 * this hook only tracks unread counts across ALL conversations for the floating chat button.
 */
export const useUnreadChats = () => {
    const { isAuthenticated } = useAuth();
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(false);
    const fetchedRef = useRef(false);

    // Fetch conversations from API
    const fetchConversations = useCallback(async () => {
        if (!isAuthenticated) return;

        try {
            setLoading(true);
            const response = await chatAPI.getConversations();
            if (response.data.success) {
                setConversations(response.data.data.conversations);
            }
        } catch (err) {
            // Silently fail — this is a background feature, not critical
            console.warn('[FloatingChat] Failed to fetch conversations:', err.message);
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated]);

    // Fetch on mount when authenticated
    useEffect(() => {
        if (isAuthenticated && !fetchedRef.current) {
            fetchedRef.current = true;
            fetchConversations();
        }
        if (!isAuthenticated) {
            fetchedRef.current = false;
            setConversations([]);
        }
    }, [isAuthenticated, fetchConversations]);

    // Listen to socket events for real-time updates
    useEffect(() => {
        if (!isAuthenticated) return;

        // New message → increment unread for that conversation
        const onNewMessage = (data) => {
            if (!data?.message || !data?.conversation) return;

            const incomingConvId = data.conversation.conversationId;

            setConversations(prev => {
                const exists = prev.some(c => c.conversationId === incomingConvId);

                if (!exists) {
                    // New conversation we haven't seen — refetch to get full data
                    fetchConversations();
                    return prev;
                }

                return prev.map(conv =>
                    conv.conversationId === incomingConvId
                        ? {
                            ...conv,
                            lastMessage: data.conversation.lastMessage,
                            unreadCount: (conv.unreadCount || 0) + 1
                        }
                        : conv
                );
            });
        };

        // Messages read → clear unread for that conversation
        const onMessagesRead = (data) => {
            if (!data?.conversationId) return;

            setConversations(prev =>
                prev.map(conv =>
                    conv.conversationId === data.conversationId
                        ? { ...conv, unreadCount: 0 }
                        : conv
                )
            );
        };

        const unsubNew = socketService.on('message:new', onNewMessage);
        const unsubRead = socketService.on('messages:read', onMessagesRead);

        return () => {
            unsubNew();
            unsubRead();
        };
    }, [isAuthenticated, fetchConversations]);

    // Compute unread chats with participant info
    const unreadChats = useMemo(() => {
        return conversations
            .filter(conv => (conv.unreadCount || 0) > 0)
            .map(conv => {
                const firstName = conv.participant?.profile?.firstName || '';
                const lastName = conv.participant?.profile?.lastName || '';
                const name = `${firstName} ${lastName}`.trim() || 'Unknown';
                const slug = name
                    .toLowerCase()
                    .replace(/[^\w\s-]/g, '')
                    .replace(/[\s_-]+/g, '-')
                    .replace(/^-+|-+$/g, '') || 'unknown-user';

                return {
                    conversationId: conv.conversationId,
                    participantName: name,
                    participantAvatar: conv.participant?.profile?.avatar || null,
                    participantSlug: slug,
                    unreadCount: conv.unreadCount
                };
            })
            .sort((a, b) => b.unreadCount - a.unreadCount); // Most unread first
    }, [conversations]);

    const totalUnread = useMemo(() => {
        return unreadChats.reduce((sum, c) => sum + c.unreadCount, 0);
    }, [unreadChats]);

    // Allow external clearing (e.g. when user navigates to a specific chat)
    const markConversationRead = useCallback((conversationId) => {
        setConversations(prev =>
            prev.map(conv =>
                conv.conversationId === conversationId
                    ? { ...conv, unreadCount: 0 }
                    : conv
            )
        );
    }, []);

    return {
        unreadChats,
        totalUnread,
        loading,
        markConversationRead,
        refetch: fetchConversations
    };
};

export default useUnreadChats;
