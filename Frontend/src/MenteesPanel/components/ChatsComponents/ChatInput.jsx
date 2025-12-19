"use client"

import React from "react"
import { Paperclip, Mic, Send } from "lucide-react"

export default function ChatInput({ onVoiceRecord, onSendMessage, onSendFile, onTyping }) {
  const [message, setMessage] = React.useState("")
  const fileInputRef = React.useRef(null)

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message)
      setMessage("")
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleChange = (e) => {
    setMessage(e.target.value)
    // Trigger typing indicator
    if (onTyping && e.target.value.trim()) {
      onTyping()
    }
  }

  return (
    <div className="bg-white border-t border-[#e5e7eb] px-3 md:px-6 py-3 md:py-4">
      <div className="flex items-center gap-2 md:gap-3">
        <input
          type="text"
          placeholder="Enter your message"
          value={message}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          className="flex-1 bg-white text-[#111111] px-3 md:px-4 py-2 md:py-3 rounded-lg border border-[#e5e7eb] focus:outline-none focus:border-[#5D38DE] placeholder:text-gray-400 text-sm md:text-base"
        />
        <button onClick={() => fileInputRef.current?.click()} className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200">
          <Paperclip className="w-4 h-4 md:w-5 md:h-5 text-gray-500" />
        </button>
        <input ref={fileInputRef} type="file" onChange={(e)=> onSendFile?.(e.target.files?.[0])} className="hidden" />
        <button onClick={onVoiceRecord} className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200">
          <Mic className="w-4 h-4 md:w-5 md:h-5 text-gray-500" />
        </button>
        {message.trim() && (
          <button onClick={handleSend} className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-[#5D38DE] flex items-center justify-center hover:bg-[#6d48ee]">
            <Send className="w-4 h-4 md:w-5 md:h-5 text-white" />
          </button>
        )}
      </div>
    </div>
  )
}


