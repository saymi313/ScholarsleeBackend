import React, { useState, useEffect, useRef, useMemo } from "react"
import ChatHeader from "./ChatHeader"
import MessageBubble from "./MessageBubble"
import ChatInput from "./ChatInput"
import DeliveryStatusModal from "./DeliveryStatusModal"
import FeatureComingSoonModal from "./FeatureCommingSoonModal"
import { useChat } from "../../../shared/hooks/useChat"
import { useAuth } from "../../../context/AuthContext"
import api from "../../../utils/api"

export default function ChatView({ chat, onBack }) {
  const [showDeliveryStatus, setShowDeliveryStatus] = useState(false)
  const [showComingSoon, setShowComingSoon] = useState(false)
  const [comingSoonFeature, setComingSoonFeature] = useState("")
  const [chatState, setChatState] = useState({
    isPinned: chat.isPinned || false,
    isMuted: chat.isMuted || false,
    isBlocked: chat.isBlocked || false,
    isArchived: chat.isArchived || false,
  })
  
  const { user } = useAuth()
  const currentUserId = useMemo(() => {
    const id = user?._id || user?.id
    return id ? id.toString() : ''
  }, [user?._id, user?.id])
  const otherParticipantId = chat.conversationId
    ? chat.conversationId
        .split('_')
        .find(id => id && id !== currentUserId)
    : null

  const { 
    messages: chatMessages, 
    loading: messagesLoading,
    sendMessage: sendChatMessage,
    fetchMessages,
    typing,
    startTyping,
    stopTyping,
  } = useChat(chat.conversationId, otherParticipantId)

  // Fetch messages when chat is selected
  useEffect(() => {
    if (chat.conversationId) {
      fetchMessages(chat.conversationId)
    }
  }, [chat.conversationId, fetchMessages])

  // Transform messages to match the UI format
  const messages = useMemo(() => {
    if (!currentUserId) return []
    const seen = new Set()
    const uniqueMessages = chatMessages.filter(msg => {
      const id = (msg?._id || msg?.id || '').toString()
      if (!id) return true
      if (seen.has(id)) return false
      seen.add(id)
      return true
    })

    return uniqueMessages.map(msg => {
      const senderId = typeof msg.sender === 'string'
        ? msg.sender
        : (msg.sender?._id || msg.sender?.id || '').toString()
      const isMe = currentUserId && senderId === currentUserId
      const senderProfile = typeof msg.sender === 'object' ? msg.sender.profile : null

      return {
        id: msg._id,
        sender: isMe ? 'me' : 'them',
        text: msg.content,
        time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        avatar: !isMe ? (senderProfile?.avatar || chat.avatar || '/u.jpeg') : null,
        senderName: !isMe
          ? `${senderProfile?.firstName || ''} ${senderProfile?.lastName || ''}`.trim() || chat.name
          : 'You',
        delivered: msg.isDelivered,
        seen: msg.isRead,
        type: msg.messageType === 'text' ? undefined : msg.messageType,
      }
    })
  }, [chatMessages, currentUserId, chat.avatar, chat.name])

  const handleSendMessage = async (messageText) => {
    if (!messageText.trim() || !chat.conversationId) return
    
    try {
      await sendChatMessage(messageText)
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  const handleTyping = () => {
    startTyping()
  }

  const handleSendFile = (file) => {
    // TODO: Implement file upload via API
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleFeatureClick = (feature) => {
    setComingSoonFeature(feature)
    setShowComingSoon(true)
  }

  const handlePinToggle = (chatId, isPinned) => {
    setChatState(prev => ({ ...prev, isPinned }))
  }

  const handleMuteToggle = (chatId, isMuted) => {
    setChatState(prev => ({ ...prev, isMuted }))
  }

  const handleBlockToggle = (chatId, isBlocked) => {
    setChatState(prev => ({ ...prev, isBlocked }))
  }

  const handleArchiveToggle = (chatId, isArchived) => {
    setChatState(prev => ({ ...prev, isArchived }))
  }

  const handleClearChat = async (chatId) => {
    try {
      const response = await api.delete(`/chat/conversations/${chatId}/messages`)
      
      if (response.data.success) {
        // Chat cleared successfully
        // Refresh messages to show empty chat
        fetchMessages(chat.conversationId)
      }
    } catch (error) {
      console.error('Error clearing chat:', error)
    }
  }

  return (
    <div className="h-full flex flex-col bg-[#111111]">
      <ChatHeader
        chat={chat}
        onBack={onBack}
        onVideoCall={() => handleFeatureClick("Video Call")}
        onVoiceCall={() => handleFeatureClick("Voice Call")}
        onInfo={() => setShowDeliveryStatus(true)}
        onPinToggle={handlePinToggle}
        onMuteToggle={handleMuteToggle}
        onBlockToggle={handleBlockToggle}
        onArchiveToggle={handleArchiveToggle}
        onClearChat={handleClearChat}
      />

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-4">
        {messagesLoading && messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5D38DE]"></div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {/* Typing Indicator */}
            {typing && (
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <div className="flex gap-1">
                  <span className="animate-bounce" style={{ animationDelay: '0ms' }}>●</span>
                  <span className="animate-bounce" style={{ animationDelay: '150ms' }}>●</span>
                  <span className="animate-bounce" style={{ animationDelay: '300ms' }}>●</span>
                </div>
                <span>{chat.name} is typing...</span>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <ChatInput 
        onVoiceRecord={() => handleFeatureClick("Voice Recording")}
        onSendMessage={handleSendMessage}
        onSendFile={handleSendFile}
        onTyping={handleTyping}
      />

      {/* Modals */}
      {showDeliveryStatus && <DeliveryStatusModal onClose={() => setShowDeliveryStatus(false)} />}
      {showComingSoon && (
        <FeatureComingSoonModal feature={comingSoonFeature} onClose={() => setShowComingSoon(false)} />
      )}
    </div>
  )
}
