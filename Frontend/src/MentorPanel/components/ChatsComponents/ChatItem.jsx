"use client"

import React from "react"
import { Pin, VolumeX, Shield, Archive } from "lucide-react"

export default function ChatItem({ chat, isSelected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full p-3 md:p-4 flex items-start gap-3 hover:bg-[#242424] transition-colors ${
        isSelected ? "bg-[#242424]" : ""
      }`}
    >
      <div className="relative flex-shrink-0">
        <img src={chat.avatar || "/a.jpg"} alt={chat.name} className="w-10 h-10 rounded-full" />
        {Number(chat.unread) > 0 && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#5D38DE] rounded-full flex items-center justify-center text-white text-xs font-medium">
            {chat.unread}
          </div>
        )}
        
        {chat.isPinned && (
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-orange-400 rounded-full flex items-center justify-center">
            <Pin className="w-2 h-2 text-white" />
          </div>
        )}
        {chat.isMuted && (
          <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-red-400 rounded-full flex items-center justify-center">
            <VolumeX className="w-2 h-2 text-white" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0 text-left">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <h3 className="text-white font-medium text-sm truncate">{chat.name}</h3>
            {chat.isBlocked && (
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
            )}
            {chat.isArchived && (
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            )}
          </div>
          <div className="flex items-center gap-1">
            {chat.sent && <span className="text-xs text-gray-500">Sent</span>}
            <span className="text-xs text-gray-500">{chat.time}</span>
          </div>
        </div>
        <p className="text-gray-400 text-sm truncate">
          {chat.isBlocked ? "This chat is blocked" : chat.isMuted ? "🔇 " + chat.message : chat.message}
        </p>
      </div>
    </button>
  )
}
