"use client"
import React from "react"
import ChatItem from "./ChatItem"

export default function ChatList({ chats, selectedChat, onSelectChat }) {
  return (
    <div className="divide-y divide-[#2a2a2a]">
      {chats.map((chat) => (
        <ChatItem
          key={chat.id}
          chat={chat}
          isSelected={selectedChat?.id === chat.id}
          onClick={() => onSelectChat(chat)}
        />
      ))}
    </div>
  )
}
