import React from "react"
import ChatItem from "./ChatItem"

export default function ChatList({ chats = [], selectedChat, onSelectChat }) {
  if (!chats.length) {
    return <div className="p-4 text-center text-gray-500">No chats yet</div>
  }
  return (
    <div className="divide-y divide-[#e5e7eb]">
      {chats.map((chat) => (
        <ChatItem key={chat.id} chat={chat} isSelected={selectedChat?.id === chat.id} onClick={() => onSelectChat(chat)} />)
      )}
    </div>
  )
}


