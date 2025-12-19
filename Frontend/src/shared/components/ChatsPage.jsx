import React, { useEffect, useMemo, useState } from "react"
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

  const [selectedChatId, setSelectedChatId] = useState(null)
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

  // Fetch conversations when socket connects
  useEffect(() => {
    if (connected) {
      fetchConversations()
    }
  }, [connected, fetchConversations])

  // Handle query parameters for creating conversations (e.g., ?mentorId=...)
  useEffect(() => {
    if (!onCreateConversation) return
    
    const mentorId = searchParams.get('mentorId')
    const mentorName = searchParams.get('name')
    const mentorAvatar = searchParams.get('avatar')
    
    if (mentorId && !creatingConversation && conversations.length > 0) {
      // Check if conversation already exists
      const existingChat = conversations.find(c => c.participant?._id === mentorId)
      
      if (existingChat) {
        // Open existing conversation
        setSelectedChatId(existingChat.conversationId)
        setSearchParams({})
      } else if (token) {
        // Create new conversation
        onCreateConversation(mentorId, mentorName, mentorAvatar, {
          setCreatingConversation,
          setSelectedChatId,
          setSearchParams
        })
      }
    }
  }, [searchParams, conversations, creatingConversation, token, onCreateConversation, setSearchParams])

  // Transform conversations to chat format for ChatsSidebar
  const chats = useMemo(() => {
    return conversations.map(conv => ({
      id: conv.conversationId,
      conversationId: conv.conversationId,
      name: conv.participant ? 
        `${conv.participant.profile?.firstName || ''} ${conv.participant.profile?.lastName || ''}`.trim() : 
        'Unknown',
      message: conv.lastMessage?.content || 'No messages yet',
      avatar: conv.participant?.profile?.avatar || '/u.jpeg',
      unread: conv.unreadCount || 0,
      time: conv.lastMessage?.timestamp || conv.lastMessage?.createdAt ? 
        formatTime(new Date(conv.lastMessage.timestamp || conv.lastMessage.createdAt)) : '',
      isPinned: conv.isPinned || false,
      isMuted: conv.isMuted || false,
      isBlocked: conv.isBlocked || false,
      isArchived: conv.isArchived || false,
      isOnline: onlineUsers.includes(conv.participant?._id),
      participantId: conv.participant?._id
    }))
  }, [conversations, onlineUsers])

  // Transform conversation to chat format for ChatView
  const selectedChat = useMemo(() => {
    if (!selectedChatId) return null
    return chats.find(c => c.id === selectedChatId) || null
  }, [selectedChatId, chats])

  const handleSelectChat = (chat) => {
    if (!chat) {
      setSelectedChatId(null)
      return
    }
    // Handle both conversation objects and chat objects
    const chatId = chat.conversationId || chat.id
    setSelectedChatId(chatId)
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

