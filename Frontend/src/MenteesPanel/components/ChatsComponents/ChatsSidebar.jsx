"use client"

import React, { useState } from "react"
import { Search, ChevronLeft, Pin, VolumeX, Archive, Shield, Trash2 } from "lucide-react"
import ChatList from "./ChatList"

export default function ChatsSidebar({ chats = [], selectedChat, onSelectChat, conversations = [], loading = false, error = null }) {
  const [activeFilter, setActiveFilter] = useState("All Chats")
  const [searchQuery, setSearchQuery] = useState("")
  const [showArchived, setShowArchived] = useState(false)

  const filters = ["All Chats", "Unread"]

  // Use real chats data (already transformed by ChatsPage) or transform conversations if needed
  // Prefer chats prop (already transformed) over conversations (raw data)
  const realChats = chats.length > 0 
    ? chats
    : (conversations.length > 0 
      ? conversations.map(conv => ({
          id: conv.conversationId || conv.id,
          conversationId: conv.conversationId || conv.id,
          name: conv.participant ? 
            `${conv.participant.profile?.firstName || ''} ${conv.participant.profile?.lastName || ''}`.trim() : 
            (conv.name || 'Unknown'),
          message: conv.lastMessage?.content || 'No messages yet',
          avatar: conv.participant?.profile?.avatar || conv.avatar || '/u.jpeg',
          unread: conv.unreadCount || conv.unread || 0,
          time: conv.lastMessage?.timestamp || conv.lastMessage?.createdAt ? 
            (conv.time || '') : '',
          isPinned: conv.isPinned || false,
          isMuted: conv.isMuted || false,
          isBlocked: conv.isBlocked || false,
          isArchived: conv.isArchived || false,
          participantId: conv.participant?._id
        }))
      : [])

  // If user navigated with query params (?name=&avatar=), add a temporary chat at top
  const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '')
  const qName = params.get('name')
  const qAvatar = params.get('avatar')
  const source = qName ? [{ id: 9999, name: qName, message: "Start chatting", avatar: qAvatar || "/u.jpeg", unread: 1, time: "now", isPinned: true, isMuted: false, isBlocked: false, isArchived: false }, ...realChats] : realChats
  
  const regularChats = source.filter(chat => !chat.isArchived)
  const archivedChats = source.filter(chat => chat.isArchived)

  const getFilteredChats = () => {
    let filtered = regularChats
    if (activeFilter === "Unread") filtered = regularChats.filter(chat => chat.unread > 0)
    else if (activeFilter === "Blocked") filtered = regularChats.filter(chat => chat.isBlocked)
    if (searchQuery) filtered = filtered.filter(chat => chat.name.toLowerCase().includes(searchQuery.toLowerCase()))
    return filtered
  }

  const filteredChats = getFilteredChats()
  const filteredArchivedChats = archivedChats.filter((chat) => chat.name.toLowerCase().includes(searchQuery.toLowerCase()))
  const totalUnread = source.reduce((total, chat) => total + (chat.unread || 0), 0)

  return (
    <div className="w-full md:w-[300px] bg-white border-r border-[#e5e7eb] flex flex-col h-full">
      <div className="p-3 md:p-4 border-b border-[#e5e7eb]">
        <div className="flex items-center gap-2 mb-3 md:mb-4">
          <h1 className="text-xl md:text-2xl font-semibold text-[#111111]">Chats</h1>
          {totalUnread > 0 && (
            <div className="bg-[#5D38DE] text-white text-xs font-bold px-2 py-1 rounded-full min-w-[20px] text-center">
              {totalUnread}
            </div>
          )}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white text-[#111111] text-sm pl-10 pr-4 py-2 md:py-2.5 rounded-lg border border-[#e5e7eb] focus:outline-none focus:border-[#5D38DE] placeholder:text-gray-400"
          />
        </div>
      </div>

      <div className="px-3 md:px-4 py-3 pt-0 border-b border-[#e5e7eb] flex gap-2 overflow-x-auto mentees-scroll-white">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-2 md:px-4 py-1.5 rounded-full text-xs md:text-sm whitespace-nowrap transition-colors flex-shrink-0 ${
              activeFilter === filter ? "bg-[#5D38DE] text-white" : "bg-white border border-[#e5e7eb] text-gray-600 hover:bg-gray-50"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto bg-white mentees-scroll-white">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <p className="text-gray-500 text-sm">Loading conversations...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-32">
            <p className="text-red-500 text-sm">Error loading conversations</p>
          </div>
        ) : filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-gray-500">
            <p className="text-sm">No conversations yet</p>
            <p className="text-xs mt-1">Start a conversation with a mentor</p>
          </div>
        ) : (
          <>
            <ChatList chats={filteredChats} selectedChat={selectedChat} onSelectChat={(c)=> onSelectChat(c)} />
            {filteredArchivedChats.length > 0 && (
          <div className="border-t border-[#e5e7eb]">
            <button
              onClick={() => setShowArchived(!showArchived)}
              className="w-full flex items-center justify-between px-4 py-3 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Archive className="w-4 h-4" />
                <span className="text-sm font-medium">Archived Chats</span>
                <div className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full">
                  {filteredArchivedChats.length}
                </div>
              </div>
              <ChevronLeft 
                className={`w-4 h-4 transition-transform ${showArchived ? 'rotate-90' : ''}`} 
              />
            </button>
            {showArchived && (
              <ChatList chats={filteredArchivedChats} selectedChat={selectedChat} onSelectChat={(c)=> onSelectChat(c)} />
            )}
          </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}


