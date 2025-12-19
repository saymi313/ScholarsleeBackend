"use client"

import React, { useState, useRef } from "react"
import { Paperclip, Mic, Send, X } from "lucide-react"

export default function ChatInput({ onVoiceRecord, onSendMessage, onSendFile, onTyping }) {
  const [message, setMessage] = useState("")
  const [selectedFile, setSelectedFile] = useState(null)
  const [isRecording, setIsRecording] = useState(false)
  const fileInputRef = useRef(null)

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message)
      setMessage("")
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleChange = (e) => {
    setMessage(e.target.value)
    // Trigger typing indicator
    if (onTyping && e.target.value.trim()) {
      onTyping()
    }
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleFileUpload = () => {
    if (selectedFile) {
      onSendFile(selectedFile)
      setSelectedFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const removeSelectedFile = () => {
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleVoiceRecord = () => {
    setIsRecording(!isRecording)
    onVoiceRecord()
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="bg-[#1a1a1a] border-t border-[#2a2a2a] px-3 md:px-6 py-3 md:py-4">
      {/* Selected File Preview */}
      {selectedFile && (
        <div className="mb-3 p-3 bg-[#242424] rounded-lg border border-[#2a2a2a]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#5D38DE] rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-bold">
                  {selectedFile.name.split('.').pop().toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-white text-sm font-medium">{selectedFile.name}</p>
                <p className="text-gray-400 text-xs">{formatFileSize(selectedFile.size)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleFileUpload}
                className="px-3 py-1 bg-[#5D38DE] text-white text-sm rounded-lg hover:bg-[#6d48ee] transition-colors"
              >
                Send
              </button>
              <button
                onClick={removeSelectedFile}
                className="w-6 h-6 rounded-full bg-[#333333] flex items-center justify-center hover:bg-[#3a3a3a] transition-colors"
              >
                <X className="w-3 h-3 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 md:gap-3">
        <input
          type="text"
          placeholder="Enter your message, upload documents or record voice"
          value={message}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          className="flex-1 bg-[#242424] text-white px-3 md:px-4 py-2 md:py-3 rounded-lg border border-[#2a2a2a] focus:outline-none focus:border-[#5D38DE] placeholder:text-gray-500 text-sm md:text-base"
        />
        
        {/* File Upload Button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-[#242424] flex items-center justify-center hover:bg-[#2a2a2a] transition-colors"
        >
          <Paperclip className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          className="hidden"
          accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
        />

        {/* Voice Record Button */}
        <button
          onClick={handleVoiceRecord}
          className={`w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center transition-colors ${
            isRecording 
              ? "bg-red-500 hover:bg-red-600" 
              : "bg-[#242424] hover:bg-[#2a2a2a]"
          }`}
        >
          <Mic className={`w-4 h-4 md:w-5 md:h-5 ${isRecording ? "text-white" : "text-gray-400"}`} />
        </button>

        {/* Send Message Button */}
        {message.trim() && (
          <button
            onClick={handleSendMessage}
            className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-[#5D38DE] flex items-center justify-center hover:bg-[#6d48ee] transition-colors"
          >
            <Send className="w-4 h-4 md:w-5 md:h-5 text-white" />
          </button>
        )}
      </div>
    </div>
  )
}
