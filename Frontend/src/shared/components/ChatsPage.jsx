import React, { useEffect, useMemo, useState, useRef } from "react"
import { useSearchParams } from "react-router-dom"
import { useSocket } from "../hooks/useSocket"
import { useChat } from "../hooks/useChat"
import { useAuthToken } from "../hooks/useAuthToken"
import { chatAPI } from "../api/chatAPI"
import SharedChatView from "./ChatView"

/**
 * Shared ChatsPage component that works for both mentor and mentee panels
 * @param {Object} props
 * @param {string} props.theme - Theme: 'light' or 'dark'
 * @param {React.Component} props.Sidebar - Sidebar component (for mentor) or Header (for mentee)
 * @param {React.Component} props.ChatsSidebar - ChatsSidebar component
 * @param {React.Component} props.ChatEmpty - ChatEmpty component
 * @param {React.Component} props.ChatView - ChatView component (will use shared one)
 * @param {React.Component} props.ChatHeader - ChatHeader component
 * @param {React.Component} props.MessageBubble - MessageBubble component
 * @param {React.Component} props.ChatInput - ChatInput component
 * @param {React.Component} props.DeliveryStatusModal - DeliveryStatusModal component
 * @param {React.Component} props.FeatureComingSoonModal - FeatureComingSoonModal component
 * @param {Function} props.onCreateConversation - Optional callback for creating conversations from query params
 */
export default function ChatsPage({
  theme = 'light',
  Sidebar,
  ChatsSidebar,
  ChatEmpty,
  ChatHeader,
  MessageBubble,
  ChatInput,
  DeliveryStatusModal,
  FeatureComingSoonModal,
  onCreateConversation
}) {
  const token = useAuthToken()
  const { socket, connected } = useSocket(token)
  const [searchParams, setSearchParams] = useSearchParams()

  const {
    conversations,
    loading,
    error,
    fetchConversations,
    onlineUsers
  } = useChat()

  // Initialize selectedChatId from URL query parameter to persist across refreshes
  const [selectedChatId, setSelectedChatId] = useState(() => {
    const chatIdFromUrl = searchParams.get('chat')
    return chatIdFromUrl || null
  })
  const [creatingConversation, setCreatingConversation] = useState(false)

  // Helper function to format time
  const formatTime = (date) => {
    const now = new Date()
    const diff = now - date
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }


  // Fetch conversations immediately on mount and when socket connects
  // This ensures conversations load even if socket reconnection is slow
  useEffect(() => {
    console.log('🔄 ChatsPage mounted or socket state changed. Connected:', connected)
    // Fetch immediately on mount, don't wait for socket
    if (!loading) {
      console.log('📞 Fetching conversations...')
      fetchConversations()
    }
  }, [fetchConversations])

  // Also refetch when socket connects/reconnects to get latest data
  useEffect(() => {
    if (connected) {
      console.log('✅ Socket connected, refetching conversations to get latest data')
      fetchConversations()
    }
  }, [connected, fetchConversations])

  // Note: URL sync effect moved after chats definition to avoid reference error

  // Ensure chat selection persists when conversations load
  // This fixes the race condition where URL has a chat ID but conversations haven't loaded yet
  const restorationAttemptedRef = useRef(false)

  useEffect(() => {
    const chatIdFromUrl = searchParams.get('chat')

    // Reset restoration flag when URL changes
    if (!chatIdFromUrl) {
      restorationAttemptedRef.current = false
      return
    }

    // If we have a chat ID in URL, conversations have loaded, and we haven't attempted restoration yet
    if (chatIdFromUrl && conversations.length > 0 && !loading && !restorationAttemptedRef.current) {
      // Try to find by slug first (name-based), then by conversationId (legacy)
      const chatBySlug = conversations.find(conv => {
        const firstName = conv.participant?.profile?.firstName || ''
        const lastName = conv.participant?.profile?.lastName || ''
        const slug = `${firstName} ${lastName}`
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, '')
        return slug === chatIdFromUrl
      })

      const chatById = conversations.find(conv => conv.conversationId === chatIdFromUrl)
      const matchedConversation = chatBySlug || chatById

      if (matchedConversation) {
        // Restore selection from URL now that conversations are loaded
        console.log('📌 Restoring chat selection from URL after conversations loaded:', chatIdFromUrl)
        setSelectedChatId(matchedConversation.conversationId)

        // Update URL to use slug if we found by conversation ID (legacy URL)
        if (!chatBySlug && chatById) {
          // Generate slug for URL update
          const firstName = matchedConversation.participant?.profile?.firstName || ''
          const lastName = matchedConversation.participant?.profile?.lastName || ''
          const slug = `${firstName} ${lastName}`
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '') || 'unknown-user'

          console.log('🔄 Updating URL from conversation ID to slug:', slug)
          setSearchParams(params => {
            const newParams = new URLSearchParams(params)
            newParams.set('chat', slug)
            return newParams
          })
        }
      } else {
        // Chat ID/slug in URL doesn't exist - clear the URL parameter
        console.log('⚠️ Chat from URL not found in conversations, clearing URL parameter')
        setSearchParams(params => {
          const newParams = new URLSearchParams(params)
          newParams.delete('chat')
          return newParams
        })
      }

      // Mark that we've attempted restoration for this URL
      restorationAttemptedRef.current = true
    }
  }, [conversations, loading, searchParams, setSearchParams, selectedChatId])

  // Handle query parameters for creating conversations (e.g., ?mentorId=...)
  useEffect(() => {
    if (!onCreateConversation) return

    const mentorId = searchParams.get('mentorId')
    const mentorName = searchParams.get('name')
    const mentorAvatar = searchParams.get('avatar')

    // Only proceed if we have a mentorId and we are not currently creating a conversation
    if (mentorId && !creatingConversation) {
      console.log('🔍 Processing chat init params:', { mentorId, mentorName, conversationsCount: conversations.length, loading });

      // If conversations are still loading, wait (unless we want to optimistically search)
      // But we can check if it exists in the current list
      const existingChat = conversations.find(c => c.participant?._id === mentorId)

      if (existingChat) {
        console.log('✅ Found existing chat, opening:', existingChat.conversationId);
        // Open existing conversation
        setSelectedChatId(existingChat.conversationId)
        setSearchParams({})
      } else {
        // If not found in current list...
        if (loading) {
          console.log('⏳ Conversations loading, waiting...');
          // If loading, we do nothing and wait for next render when loading is false
          return;
        }

        // If not loading and not found, creates new conversation
        if (token) {
          console.log('🆕 Chat not found in list, creating new...');
          onCreateConversation(mentorId, mentorName, mentorAvatar, {
            setCreatingConversation,
            setSelectedChatId,
            setSearchParams
          })
        }
      }
    }
  }, [searchParams, conversations, creatingConversation, token, onCreateConversation, setSearchParams, loading])

  // Transform conversations to chat format for ChatsSidebar
  const chats = useMemo(() => {
    return conversations.map(conv => {
      // Generate slug from participant name for URL
      const firstName = conv.participant?.profile?.firstName || ''
      const lastName = conv.participant?.profile?.lastName || ''
      const nameSlug = `${firstName} ${lastName}`
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/[\s_-]+/g, '-')  // Replace spaces with hyphens
        .replace(/^-+|-+$/g, '')    // Trim hyphens
        || 'unknown-user'

      return {
        id: conv.conversationId,
        conversationId: conv.conversationId,
        participantSlug: nameSlug, // Use this in URL instead of conversationId
        mentorSlug: conv.participant?.mentorProfile?.slug, // For mentor profile navigation
        mentorId: conv.participant?._id, // Fallback for profile navigation
        name: conv.participant ?
          `${conv.participant.profile?.firstName || ''} ${conv.participant.profile?.lastName || ''}`.trim() :
          'Unknown',
        message: conv.lastMessage?.content || 'No messages yet',
        avatar: conv.participant?.profile?.avatar,
        unread: conv.unreadCount || 0,
        time: conv.lastMessage?.timestamp || conv.lastMessage?.createdAt ?
          formatTime(new Date(conv.lastMessage.timestamp || conv.lastMessage.createdAt)) : '',
        isPinned: conv.isPinned || false,
        isMuted: conv.isMuted || false,
        isBlocked: conv.isBlocked || false,
        isArchived: conv.isArchived || false,
        isOnline: onlineUsers.includes(conv.participant?._id),
        participantId: conv.participant?._id
      }
    })
  }, [conversations, onlineUsers])

  // Sync selectedChatId with URL query parameter changes (e.g., browser back/forward)
  // Must be AFTER chats definition to avoid reference error
  useEffect(() => {
    const chatIdFromUrl = searchParams.get('chat')

    // If URL changed, resolve slug to conversation ID
    if (chatIdFromUrl && chatIdFromUrl !== selectedChatId) {
      // Try to find by slug first, then by ID
      const matchingChat = chats.find(c => c.participantSlug === chatIdFromUrl) ||
        chats.find(c => c.conversationId === chatIdFromUrl)

      if (matchingChat) {
        // Set the actual conversation ID, not the slug
        setSelectedChatId(matchingChat.conversationId)
      } else if (!matchingChat && chatIdFromUrl) {
        // If it's a slug/ID we don't recognize yet, keep it (conversations might still be loading)
        setSelectedChatId(chatIdFromUrl)
      }
    } else if (!chatIdFromUrl && selectedChatId) {
      // URL cleared, clear selection
      setSelectedChatId(null)
    }
  }, [searchParams, chats, selectedChatId])

  // Transform conversation to chat format for ChatView
  const selectedChat = useMemo(() => {
    if (!selectedChatId) return null
    return chats.find(c => c.id === selectedChatId) || null
  }, [selectedChatId, chats])

  const handleSelectChat = (chat) => {
    if (!chat) {
      setSelectedChatId(null)
      // Remove chat query parameter from URL
      setSearchParams(params => {
        const newParams = new URLSearchParams(params)
        newParams.delete('chat')
        return newParams
      })
      return
    }
    // Handle both conversation objects and chat objects
    const chatId = chat.conversationId || chat.id
    setSelectedChatId(chatId)
    // Use participant slug in URL for better readability
    const urlSlug = chat.participantSlug || chatId
    console.log('💬 Selecting chat:', {
      name: chat.name,
      conversationId: chatId,
      participantSlug: chat.participantSlug,
      urlSlug
    })
    setSearchParams(params => {
      const newParams = new URLSearchParams(params)
      newParams.set('chat', urlSlug)
      return newParams
    })
  }

  const updateChat = (chatId, patch) => {
    // Update is handled by useChat hook through socket events
    // This is kept for backward compatibility
  }

  // Theme-based styling
  const bgColor = theme === 'dark' ? 'bg-[#111111]' : 'bg-gray-100'
  const textColor = theme === 'dark' ? 'text-white' : 'text-[#111111]'

  // Determine if Sidebar is actually a Header (for mentee) or true Sidebar (for mentor)
  const isHeaderLayout = theme === 'light'

  if (isHeaderLayout) {
    // Mentee layout: Header at top, chat content below
    return (
      <div className={`flex flex-col min-h-screen ${bgColor} ${textColor} font-['Poppins'] overflow-x-hidden`}>
        {/* Header - full width at top */}
        {Sidebar && <Sidebar />}

        {/* Main content area */}
        <main className="flex-1 p-0 md:p-6 flex flex-col h-[calc(100vh-64px)] md:h-auto">
          <div className={`flex-1 ${theme === 'dark' ? 'bg-[#111111]' : 'bg-white md:rounded-2xl md:shadow-lg md:border md:border-gray-200'} overflow-hidden flex flex-col md:flex-row`}>
            {/* Chat Sidebar - List of conversations */}
            <div className={`${selectedChat ? 'hidden md:block' : 'block'} w-full md:w-[300px] md:flex-shrink-0 mentees-scroll-white overflow-y-auto`}>
              <ChatsSidebar
                chats={chats}
                conversations={conversations}
                selectedChat={selectedChat}
                onSelectChat={handleSelectChat}
                loading={loading}
                error={error}
                onlineUsers={onlineUsers}
              />
            </div>

            {/* Chat View - Main chat area */}
            <div className={`${selectedChat ? 'block' : 'hidden md:block'} flex-1 mentees-scroll-white overflow-y-auto`}>
              {selectedChat ? (
                <SharedChatView
                  chat={selectedChat}
                  onBack={() => setSelectedChatId(null)}
                  onUpdateChat={updateChat}
                  theme={theme}
                  ChatHeader={ChatHeader}
                  MessageBubble={MessageBubble}
                  ChatInput={ChatInput}
                  DeliveryStatusModal={DeliveryStatusModal}
                  FeatureComingSoonModal={FeatureComingSoonModal}
                />
              ) : (
                <ChatEmpty />
              )}
            </div>
          </div>
        </main>
      </div>
    )
  }

  // Mentor layout: Sidebar on left, chat content on right
  return (
    <div className={`flex h-screen ${bgColor} ${textColor} font-['Poppins'] overflow-hidden`}>
      {/* Sidebar - on the left */}
      {Sidebar && <Sidebar hideMobileMenu={!!selectedChat} />}

      {/* Chat Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Sidebar - List of conversations */}
        <div className={`${selectedChat ? 'hidden md:block' : 'block'} w-full md:w-[300px] md:flex-shrink-0 bg-[#111111] overflow-y-auto`}>
          <ChatsSidebar
            chats={chats}
            conversations={conversations}
            selectedChat={selectedChat}
            onSelectChat={handleSelectChat}
            loading={loading}
            error={error}
            onlineUsers={onlineUsers}
          />
        </div>

        {/* Chat View - Main chat area */}
        <div className={`${selectedChat ? 'block' : 'hidden md:block'} flex-1 bg-[#111111] overflow-hidden`}>
          {selectedChat ? (
            <SharedChatView
              chat={selectedChat}
              onBack={() => setSelectedChatId(null)}
              onUpdateChat={updateChat}
              theme={theme}
              ChatHeader={ChatHeader}
              MessageBubble={MessageBubble}
              ChatInput={ChatInput}
              DeliveryStatusModal={DeliveryStatusModal}
              FeatureComingSoonModal={FeatureComingSoonModal}
            />
          ) : (
            <ChatEmpty />
          )}
        </div>
      </div>
    </div>
  )
}

