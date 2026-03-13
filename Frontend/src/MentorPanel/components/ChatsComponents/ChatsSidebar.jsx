"use client"

import React, { useState } from "react"
import { Search, ChevronLeft, Pin, VolumeX, Archive, Shield, Trash2 } from "lucide-react"
import ChatList from "./ChatList"
import { useAuth } from "../../../context/AuthContext"
import NameAvatar from "./NameAvatar"

export default function ChatsSidebar({ selectedChat, onSelectChat, conversations = [], loading = false, error = '', onlineUsers = [] }) {
  const { user } = useAuth()
  const [activeFilter, setActiveFilter] = useState("All Chats")
  const [searchQuery, setSearchQuery] = useState("")
  const [showArchived, setShowArchived] = useState(false)

  const filters = ["All Chats", "Unread", "Blocked"]

  // Transform conversations to chat format
  const chats = conversations.map(conv => {
    const unreadCount = Number(conv.unreadCount || 0)
    return {
      id: conv.conversationId,
      conversationId: conv.conversationId,
      name: conv.participant ?
        `${conv.participant.profile?.firstName || ''} ${conv.participant.profile?.lastName || ''}`.trim() :
        'Unknown',
      message: conv.lastMessage?.content || '',
      avatar: conv.participant?.profile?.avatar,
      unread: unreadCount,
      time: conv.lastMessage?.createdAt ?
        formatTime(conv.lastMessage.createdAt) : '',
      isPinned: conv.isPinned || false,
      isMuted: conv.isMuted || false,
      isBlocked: conv.isBlocked || false,
      isArchived: conv.isArchived || false,
      isOnline: onlineUsers.includes(conv.participant?._id),
      participant: conv.participant,
    }
  })

  console.log('📋 ChatsSidebar: Total conversations:', conversations.length);
  console.log('📋 ChatsSidebar: Transformed chats:', chats.length);

  // Helper function to format time
  function formatTime(timestamp) {
    const now = new Date()
    const messageDate = new Date(timestamp)
    const diffInMs = now - messageDate
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
      return `${diffInMinutes}m ago`
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`
    } else if (diffInDays === 1) {
      return '1d ago'
    } else {
      return `${diffInDays}d ago`
    }
  }

  // Separate regular and archived chats
  const regularChats = chats.filter(chat => !chat.isArchived)
  const archivedChats = chats.filter(chat => chat.isArchived)

  // Filter chats based on active filter
  const getFilteredChats = () => {
    let filtered = regularChats

    if (activeFilter === "Unread") {
      filtered = regularChats.filter(chat => chat.unread > 0)
    } else if (activeFilter === "Blocked") {
      filtered = regularChats.filter(chat => chat.isBlocked)
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(chat =>
        chat.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    return filtered
  }

  const filteredChats = getFilteredChats()
  const filteredArchivedChats = archivedChats.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Calculate total unread messages
  const totalUnread = chats.reduce((total, chat) => total + (chat.unread || 0), 0)

  return (
    <div className="w-full md:w-[300px] bg-[#1a1a1a] border-r border-[#2a2a2a] flex flex-col h-full">
      {/* Header */}
      <div className="p-3 md:p-4 pt-16 md:pt-3 lg:pt-4 border-b border-[#2a2a2a]">
        <div className="flex items-center gap-2 mb-3 md:mb-4">
          <h1 className="text-xl md:text-2xl font-semibold text-white">Chats</h1>
          {totalUnread > 0 && (
            <div className="bg-[#5D38DE] text-white text-xs font-bold px-2 py-1 rounded-full min-w-[20px] text-center">
              {totalUnread}
            </div>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#242424] text-white text-sm pl-10 pr-4 py-2 md:py-2.5 rounded-lg border border-[#2a2a2a] focus:outline-none focus:border-[#5D38DE] placeholder:text-gray-500"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="px-3 md:px-4 py-3 pt-0 border-b border-[#2a2a2a] flex gap-2 overflow-x-auto">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-2 md:px-4 py-1.5 rounded-full text-xs md:text-sm whitespace-nowrap transition-colors flex-shrink-0 ${activeFilter === filter ? "bg-[#5D38DE] text-white" : "bg-[#242424] text-gray-400 hover:bg-[#2a2a2a]"
              }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5D38DE]"></div>
          </div>
        ) : error ? (
          <div className="px-4 py-8 text-center">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        ) : filteredChats.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <p className="text-gray-400 text-sm">No chats found</p>
          </div>
        ) : (
          <ChatList chats={filteredChats} selectedChat={selectedChat} onSelectChat={onSelectChat} />
        )}

        {/* Archived Chats Section */}
        {filteredArchivedChats.length > 0 && (
          <div className="border-t border-[#2a2a2a]">
            <button
              onClick={() => setShowArchived(!showArchived)}
              className="w-full flex items-center justify-between px-4 py-3 text-gray-400 hover:bg-[#242424] transition-colors"
            >
              <div className="flex items-center gap-2">
                <Archive className="w-4 h-4" />
                <span className="text-sm font-medium">Archived Chats</span>
                <div className="bg-gray-600 text-white text-xs px-2 py-0.5 rounded-full">
                  {filteredArchivedChats.length}
                </div>
              </div>
              <ChevronLeft
                className={`w-4 h-4 transition-transform ${showArchived ? 'rotate-90' : ''}`}
              />
            </button>

            {showArchived && (
              <ChatList chats={filteredArchivedChats} selectedChat={selectedChat} onSelectChat={onSelectChat} />
            )}
          </div>
        )}
      </div>

      {/* User Profile */}
      <div className="p-3 md:p-4 border-t border-[#2a2a2a]">
        <div className="flex items-center gap-3">
          <NameAvatar
            src={user?.profile?.avatar}
            name={`${user?.profile?.firstName || ''} ${user?.profile?.lastName || ''}`.trim() || 'Mentor'}
            size="w-10 h-10 md:w-12 md:h-12"
          />
          <div className="min-w-0 flex-1">
            <h3 className="text-white font-medium text-sm md:text-base truncate">
              {`${user?.profile?.firstName || ''} ${user?.profile?.lastName || ''}`.trim() || 'Mentor'}
            </h3>
            <p className="text-gray-400 text-xs md:text-sm truncate">
              {user?.role === 'mentor' ? 'Mentor' : user?.role || 'User'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
