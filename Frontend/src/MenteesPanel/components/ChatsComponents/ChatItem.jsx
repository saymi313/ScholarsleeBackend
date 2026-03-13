import React from "react"
import { Pin, VolumeX } from "lucide-react"
import NameAvatar from "../../../shared/components/NameAvatar"

export default function ChatItem({ chat, isSelected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full p-3 md:p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors ${isSelected ? "bg-gray-50" : ""
        }`}
    >
      <NameAvatar src={chat.avatar} name={chat.name} size="w-10 h-10" />
      <div className="min-w-0 flex-1 text-left">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 min-w-0">
            <h4 className="text-[#111111] font-medium truncate">{chat.name}</h4>
            {chat.isPinned && <Pin className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />}
            {chat.isMuted && <VolumeX className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />}
          </div>
          <span className="text-xs text-gray-400 flex-shrink-0">{chat.time}</span>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-sm text-gray-500 truncate flex-1">{chat.message}</p>
          {!!chat.unread && (
            <span className="bg-[#5D38DE] text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
              {chat.unread}
            </span>
          )}
        </div>
      </div>
    </button>
  )
}


