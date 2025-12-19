import React, { useState, useEffect, useRef, useMemo } from "react"
import { useChat } from "../hooks/useChat"
import { useAuth } from "../../context/AuthContext"
import { chatAPI } from "../api/chatAPI"

/**
 * Shared ChatView component that works for both mentor and mentee panels
 * @param {Object} props
 * @param {Object} props.chat - Chat/conversation object
 * @param {Function} props.onBack - Callback when back button is clicked
 * @param {Function} props.onUpdateChat - Callback to update chat in parent (optional)
 * @param {string} props.theme - Theme: 'light' or 'dark'
 * @param {React.Component} props.ChatHeader - ChatHeader component
 * @param {React.Component} props.MessageBubble - MessageBubble component
 * @param {React.Component} props.ChatInput - ChatInput component
 * @param {React.Component} props.DeliveryStatusModal - DeliveryStatusModal component
 * @param {React.Component} props.FeatureComingSoonModal - FeatureComingSoonModal component
 */
export default function ChatView({ 
  chat, 
  onBack, 
  onUpdateChat,
  theme = 'light',
  ChatHeader,
  MessageBubble,
  ChatInput,
  DeliveryStatusModal,
  FeatureComingSoonModal
}) {
  const { user } = useAuth()
  const currentUserId = useMemo(() => {
    const id = user?._id || user?.id
    return id ? id.toString() : ''
  }, [user?._id, user?.id])

  const [showDeliveryStatus, setShowDeliveryStatus] = useState(false)
  const [showComingSoon, setShowComingSoon] = useState(false)
  const [showClearChatConfirm, setShowClearChatConfirm] = useState(false)
  const [comingSoonFeature, setComingSoonFeature] = useState("")
  const [chatState, setChatState] = useState({
    isPinned: chat?.isPinned || false,
    isMuted: chat?.isMuted || false,
    isBlocked: chat?.isBlocked || false,
    isArchived: chat?.isArchived || false,
  })

  // Extract conversation ID and participant ID
  const conversationId = chat?.conversationId || chat?.id
  const participantId = chat?.participantId || (
    conversationId && conversationId.split('_').find(id => id && id !== currentUserId)
  )

  const { 
    messages: chatMessages, 
    loading: messagesLoading,
    sendMessage: sendChatMessage,
    fetchMessages,
    typing,
    startTyping,
    stopTyping,
    updateConversationSettings,
    markAsRead
  } = useChat(conversationId, participantId)

  const messagesEndRef = useRef(null)
  const typingTimeoutRef = useRef(null)

  // Fetch messages when chat is selected
  useEffect(() => {
    if (conversationId) {
      fetchMessages(conversationId)
    }
  }, [conversationId, fetchMessages])

  // Mark as read when chat is opened
  useEffect(() => {
    if (conversationId) {
      markAsRead()
    }
  }, [conversationId, markAsRead])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatMessages])

  // Transform messages to UI format
  const messages = useMemo(() => {
    const seen = new Set()
    return chatMessages
      .filter(msg => {
        const id = (msg?._id || msg?.id || '').toString()
        if (!id) return true
        if (seen.has(id)) return false
        seen.add(id)
        return true
      })
      .map(msg => {
        // Robust sender ID extraction - handle all cases
        const senderId = (() => {
          if (typeof msg.sender === 'string') {
            return msg.sender.toString();
          }
          if (msg.sender?._id) {
            return msg.sender._id.toString();
          }
          if (msg.sender?.id) {
            return msg.sender.id.toString();
          }
          return '';
        })();
        
        // Normalize both IDs to strings for consistent comparison
        const normalizedSenderId = senderId.toString();
        const normalizedCurrentUserId = currentUserId ? currentUserId.toString() : '';
        const isMe = normalizedCurrentUserId && normalizedSenderId && normalizedSenderId === normalizedCurrentUserId;
        
        const senderProfile = typeof msg.sender === 'object' && msg.sender !== null ? msg.sender.profile : null

        return {
          id: msg._id || msg.id,
          sender: isMe ? 'me' : 'them',
          text: msg.content,
          time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          avatar: isMe 
            ? user?.profile?.avatar 
            : (senderProfile?.avatar || chat?.avatar || '/u.jpeg'),
          senderName: !isMe
            ? (senderProfile ? `${senderProfile.firstName || ''} ${senderProfile.lastName || ''}`.trim() : chat?.name) || 'Unknown'
            : 'You',
          delivered: msg.isDelivered,
          seen: msg.isRead,
          type: msg.messageType === 'text' ? undefined : msg.messageType,
        }
      })
  }, [chatMessages, currentUserId, user?.profile?.avatar, chat?.avatar, chat?.name])

  const handleSendMessage = async (messageText) => {
    if (!messageText?.trim() || !conversationId) return
    
    try {
      await sendChatMessage(messageText)
      
      // Update conversation in parent
      if (onUpdateChat) {
        onUpdateChat(conversationId, { 
          message: messageText, 
          time: 'now' 
        })
      }
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const handleTyping = () => {
    if (!conversationId || !participantId) return
    
    startTyping()
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping()
    }, 3000)
  }

  const handlePinToggle = async (chatId, isPinned) => {
    setChatState(prev => ({ ...prev, isPinned }))
    onUpdateChat?.(chatId, { isPinned })
    
    try {
      await updateConversationSettings({ isPinned })
    } catch (error) {
      console.error('Error updating pin status:', error)
    }
  }
  
  const handleMuteToggle = async (chatId, isMuted) => {
    setChatState(prev => ({ ...prev, isMuted }))
    onUpdateChat?.(chatId, { isMuted })
    
    try {
      await updateConversationSettings({ isMuted })
    } catch (error) {
      console.error('Error updating mute status:', error)
    }
  }
  
  const handleArchiveToggle = async (chatId, isArchived) => {
    setChatState(prev => ({ ...prev, isArchived }))
    onUpdateChat?.(chatId, { isArchived })
    
    try {
      await updateConversationSettings({ isArchived })
      
      // If archived, go back to chat list
      if (isArchived && onBack) {
        onBack()
      }
    } catch (error) {
      console.error('Error updating archive status:', error)
    }
  }
  
  const handleBlockToggle = async (chatId, isBlocked) => {
    setChatState(prev => ({ ...prev, isBlocked }))
    onUpdateChat?.(chatId, { isBlocked })
    
    try {
      await updateConversationSettings({ isBlocked })
    } catch (error) {
      console.error('Error updating block status:', error)
    }
  }

  const handleClearChat = () => {
    setShowClearChatConfirm(true)
  }
  
  const confirmClearChat = async () => {
    try {
      await chatAPI.deleteAllMessages(conversationId)
      
      // Clear messages locally
      fetchMessages(conversationId)
      
      // Update conversation in parent
      if (onUpdateChat) {
        onUpdateChat(conversationId, { 
          message: 'No messages yet', 
          time: '' 
        })
      }
      
      setShowClearChatConfirm(false)
    } catch (error) {
      console.error('Error clearing chat:', error)
      setShowClearChatConfirm(false)
    }
  }

  const handleFeatureClick = (feature) => {
    setComingSoonFeature(feature)
    setShowComingSoon(true)
  }

  // Theme-based styling
  const bgColor = theme === 'dark' ? 'bg-[#111111]' : 'bg-white'
  const textColor = theme === 'dark' ? 'text-white' : 'text-[#111111]'
  const scrollClass = theme === 'dark' ? '' : 'mentees-scroll-white'
  const spinnerColor = theme === 'dark' ? 'border-[#5D38DE]' : 'border-purple-600'

  return (
    <div className={`h-full flex flex-col ${bgColor}`}>
      <ChatHeader
        chat={{ ...chat, ...chatState }}
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
      
      <div className={`flex-1 overflow-y-auto p-3 md:p-6 space-y-4 ${bgColor} ${scrollClass}`}>
        {messagesLoading && messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${spinnerColor}`}></div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {typing && (
              <div className={`flex items-center gap-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} px-4`}>
                <div className="flex gap-1">
                  <div className={`w-2 h-2 ${theme === 'dark' ? 'bg-gray-400' : 'bg-gray-400'} rounded-full animate-bounce`} style={{ animationDelay: '0ms' }}></div>
                  <div className={`w-2 h-2 ${theme === 'dark' ? 'bg-gray-400' : 'bg-gray-400'} rounded-full animate-bounce`} style={{ animationDelay: '150ms' }}></div>
                  <div className={`w-2 h-2 ${theme === 'dark' ? 'bg-gray-400' : 'bg-gray-400'} rounded-full animate-bounce`} style={{ animationDelay: '300ms' }}></div>
                </div>
                <span>{chat?.name} is typing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
      
      <ChatInput 
        onVoiceRecord={() => handleFeatureClick("Voice Recording")}
        onSendMessage={handleSendMessage} 
        onSendFile={() => handleFeatureClick("File Upload")}
        onTyping={handleTyping}
      />

      {showDeliveryStatus && <DeliveryStatusModal onClose={() => setShowDeliveryStatus(false)} />}
      {showComingSoon && (
        <FeatureComingSoonModal 
          feature={comingSoonFeature || 'Feature'} 
          onClose={() => setShowComingSoon(false)} 
        />
      )}
      
      {/* Clear Chat Confirmation Modal */}
      {showClearChatConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${bgColor} rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fade-in`}>
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className={`text-xl font-semibold ${textColor} mb-2`}>Clear Chat History?</h3>
              <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
                Are you sure you want to clear all messages in this chat? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowClearChatConfirm(false)}
                  className={`flex-1 px-4 py-3 ${theme === 'dark' ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} rounded-lg font-medium transition-colors`}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmClearChat}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  Clear Chat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

