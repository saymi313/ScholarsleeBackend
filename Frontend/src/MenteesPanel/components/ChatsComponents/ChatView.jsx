import React, { useState, useEffect, useRef, useMemo } from "react"
import ChatHeader from "./ChatHeader"
import MessageBubble from "./MessageBubble"
import ChatInput from "./ChatInput"
import DeliveryStatusModal from "./DeliveryStatusModal"
import FeatureComingSoonModal from "./FeatureComingSoonModal"
import socketService from "../../../shared/services/socketService"
import { useAuth } from "../../../context/AuthContext"
import api from "../../../utils/api"

export default function ChatView({ chat, onBack, onUpdateChat }) {
  const { user } = useAuth()
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  const currentUserId = useMemo(() => {
    const id = user?._id || user?.id
    return id ? id.toString() : ''
  }, [user?._id, user?.id])
  const [showDeliveryStatus, setShowDeliveryStatus] = useState(false)
  const [showComingSoon, setShowComingSoon] = useState(false)
  const [showClearChatConfirm, setShowClearChatConfirm] = useState(false)
  const [comingSoonFeature, setComingSoonFeature] = useState("")
  const [chatState, setChatState] = useState({
    isPinned: chat.isPinned || false,
    isMuted: chat.isMuted || false,
    isBlocked: chat.isBlocked || false,
    isArchived: chat.isArchived || false,
  })
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [typing, setTyping] = useState(false)
  const messagesEndRef = useRef(null)
  const typingTimeoutRef = useRef(null)

  // Fetch messages when chat is selected
  useEffect(() => {
    const fetchMessages = async () => {
      if (!chat?.id || !token || !currentUserId) return
      
      
      try {
        setLoading(true)
        const response = await api.get(`/chat/conversations/${chat.id}/messages`)
        
        if (response.data.success && response.data.data.messages) {
          // Transform API messages to UI format
          const transformedMessages = response.data.data.messages.map(msg => {
            const senderId = (
              typeof msg.sender === 'string' 
                ? msg.sender 
                : (msg.sender?._id || msg.sender?.id || '')
            ).toString()
            const isMe = currentUserId && senderId === currentUserId
            return {
              id: msg._id,
              sender: isMe ? 'me' : 'them',
              text: msg.content,
              time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              avatar: isMe ? user?.profile?.avatar : (chat.avatar || msg.sender?.profile?.avatar),
              delivered: msg.isDelivered,
              seen: msg.isRead
            }
          })
          
          setMessages(transformedMessages)
        }
      } catch (error) {
        console.error('Error fetching messages:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchMessages()
  }, [chat?.id, token, user?.id, currentUserId])

  // Listen for new messages
  useEffect(() => {
    if (!socketService.isConnected()) return

    const handleNewMessage = (data) => {
      if (data.conversation.conversationId === chat?.id) {
        // Only add if message is from other user (not from me)
        const senderId = (
          typeof data.message?.sender === 'string' 
            ? data.message.sender 
            : (data.message?.sender?._id || data.message?.sender?.id || '')
        ).toString()
        console.log('🔔 New message received:', {
          senderId,
          currentUserId,
          isFromMe: currentUserId && senderId === currentUserId
        })
        if (!currentUserId || senderId !== currentUserId) {
          const newMsg = {
            id: data.message._id,
            sender: 'them',
            text: data.message.content,
            time: new Date(data.message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            avatar: chat.avatar,
            delivered: data.message.isDelivered,
            seen: data.message.isRead
          }
          
          // Check if message already exists (prevent duplicates)
          setMessages(prev => {
            const exists = prev.some(msg => msg.id === newMsg.id)
            if (exists) return prev
            return [...prev, newMsg]
          })
          
          // Update conversation in parent
          if (onUpdateChat) {
            onUpdateChat(chat.id, { 
              message: data.message.content, 
              time: 'now',
              unread: (chat.unread || 0) + 1
            })
          }
        }
      }
    }

    const handleMessageStatus = (data) => {
      setMessages(prev => prev.map(msg => 
        msg.id === data.messageId 
          ? { ...msg, [data.status === 'delivered' ? 'delivered' : 'seen']: true }
          : msg
      ))
    }

    const handleTypingStart = (data) => {
      if (data.conversationId === chat?.id) {
        setTyping(true)
      }
    }

    const handleTypingStop = (data) => {
      if (data.conversationId === chat?.id) {
        setTyping(false)
      }
    }

    const unsubNewMessage = socketService.on('message:new', handleNewMessage)
    const unsubMessageStatus = socketService.on('message:status', handleMessageStatus)
    const unsubTypingStart = socketService.on('typing:start', handleTypingStart)
    const unsubTypingStop = socketService.on('typing:stop', handleTypingStop)

    return () => {
      unsubNewMessage()
      unsubMessageStatus()
      unsubTypingStart()
      unsubTypingStop()
    }
  }, [chat?.id, chat?.avatar, currentUserId, user?.profile?.avatar])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async (messageText) => {
    if (!messageText?.trim() || !chat?.id) return
    
    const tempId = `temp_${Date.now()}`
    const tempMessage = {
      id: tempId,
      sender: 'me',
      text: messageText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatar: user?.profile?.avatar,
      delivered: false,
      seen: false,
      pending: true
    }
    
    // Add message optimistically to UI
    setMessages(prev => [...prev, tempMessage])
    
    try {
      // Send message via API
      const response = await api.post('/chat/messages', {
        conversationId: chat.id,
        content: messageText,
        messageType: 'text'
      })
      
      if (response.data.success && response.data.data.message) {
        // Replace temp message with real message from server
        setMessages(prev => prev.map(msg => 
          msg.id === tempId 
            ? {
                id: response.data.data.message._id,
                sender: 'me',
                text: response.data.data.message.content,
                time: new Date(response.data.data.message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                avatar: user?.profile?.avatar,
                delivered: true,
                seen: false,
                pending: false
              }
            : msg
        ))
        
        // Update conversation in parent
        if (onUpdateChat) {
          onUpdateChat(chat.id, { 
            message: messageText, 
            time: 'now' 
          })
        }
      }
    } catch (error) {
      console.error('Error sending message:', error)
      // Mark message as failed
      setMessages(prev => prev.map(msg => 
        msg.id === tempId ? { ...msg, failed: true, pending: false } : msg
      ))
    }
  }

  const handleTyping = () => {
    if (!chat?.participantId || !chat?.id) return
    
    socketService.startTyping(chat.id, chat.participantId)
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      socketService.stopTyping(chat.id, chat.participantId)
    }, 3000)
  }

  const handlePinToggle = async (chatId, isPinned) => {
    setChatState(prev => ({ ...prev, isPinned }))
    onUpdateChat?.(chatId, { isPinned })
    
    try {
      await api.put(`/chat/conversations/${chat.id}/settings`, { isPinned })
    } catch (error) {
      console.error('Error updating pin status:', error)
    }
  }
  
  const handleMuteToggle = async (chatId, isMuted) => {
    setChatState(prev => ({ ...prev, isMuted }))
    onUpdateChat?.(chatId, { isMuted })
    
    try {
      await api.put(`/chat/conversations/${chat.id}/settings`, { isMuted })
    } catch (error) {
      console.error('Error updating mute status:', error)
    }
  }
  
  const handleArchiveToggle = async (chatId, isArchived) => {
    setChatState(prev => ({ ...prev, isArchived }))
    onUpdateChat?.(chatId, { isArchived })
    
    try {
      await api.put(`/chat/conversations/${chat.id}/settings`, { isArchived })
      
      // If archived, go back to chat list
      if (isArchived && onBack) {
        onBack()
      }
    } catch (error) {
      console.error('Error updating archive status:', error)
    }
  }
  
  const handleClearChat = () => {
    setShowClearChatConfirm(true)
  }
  
  const confirmClearChat = async () => {
    try {
      // Call backend to delete messages from database
      const response = await api.delete(`/chat/conversations/${chat.id}/messages`)
      
      if (response.data.success) {
        // Clear messages locally after successful deletion
        setMessages([])
        
        // Update conversation in parent to show "No messages yet"
        if (onUpdateChat) {
          onUpdateChat(chat.id, { 
            message: 'No messages yet', 
            time: '' 
          })
        }
      } else {
        console.error('Failed to clear chat:', response.data.message)
      }
      
      setShowClearChatConfirm(false)
    } catch (error) {
      console.error('Error clearing chat:', error)
      setShowClearChatConfirm(false)
    }
  }
  
  const handleBlockToggle = async (chatId, isBlocked) => {
    setChatState(prev => ({ ...prev, isBlocked }))
    onUpdateChat?.(chatId, { isBlocked })
    
    try {
      await api.put(`/chat/conversations/${chat.id}/settings`, { isBlocked })
    } catch (error) {
      console.error('Error updating block status:', error)
    }
  }

  return (
    <div className="h-full flex flex-col bg-white">
      <ChatHeader
        chat={{ ...chat, ...chatState }}
        onBack={onBack}
        onVideoCall={() => setShowComingSoon(true)}
        onVoiceCall={() => setShowComingSoon(true)}
        onInfo={() => setShowDeliveryStatus(true)}
        onPinToggle={handlePinToggle}
        onMuteToggle={handleMuteToggle}
        onBlockToggle={handleBlockToggle}
        onArchiveToggle={handleArchiveToggle}
        onClearChat={handleClearChat}
      />
      <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-4 bg-white mentees-scroll-white">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {typing && (
              <div className="flex items-center gap-2 text-sm text-gray-500 px-4">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <span>{chat?.name} is typing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
      <ChatInput 
        onVoiceRecord={() => setShowComingSoon(true)} 
        onSendMessage={handleSendMessage} 
        onSendFile={() => setShowDeliveryStatus(true)} 
        onTyping={handleTyping}
      />

      {showDeliveryStatus && <DeliveryStatusModal onClose={() => setShowDeliveryStatus(false)} />}
      {showComingSoon && <FeatureComingSoonModal feature={comingSoonFeature || 'Voice Recording'} onClose={() => setShowComingSoon(false)} />}
      
      {/* Clear Chat Confirmation Modal */}
      {showClearChatConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fade-in">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Clear Chat History?</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to clear all messages in this chat? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowClearChatConfirm(false)}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
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


