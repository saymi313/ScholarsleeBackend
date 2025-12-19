"use client"

import React, { useEffect, useRef, useState } from "react"
import { ArrowLeft, Video, Phone, Info, MoreVertical, Pin, PinOff, VolumeX, Volume2, Archive, ArchiveRestore, Trash2 } from "lucide-react"

export default function ChatHeader({ chat, onBack, onVideoCall, onVoiceCall, onInfo, onPinToggle, onMuteToggle, onArchiveToggle, onClearChat }) {
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef(null)
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  useEffect(() => {
    const onClick = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowDropdown(false) }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])
  return (
    <div className="bg-white border-b border-[#e5e7eb] px-4 md:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 md:gap-4 min-w-0">
          <button onClick={onBack} className="md:hidden w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
            <ArrowLeft className="w-4 h-4 text-gray-600" />
          </button>
          <img src={chat.avatar || "/a.jpg"} alt={chat.name} className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-[#e5e7eb]" />
          <div className="min-w-0">
            <h2 className="text-[#111111] font-semibold text-base md:text-lg truncate">{chat.name}</h2>
            <p className="text-gray-500 text-xs md:text-sm truncate">Online</p>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <button onClick={onVideoCall} className="hidden sm:flex w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
            <Video className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
          </button>
          <button onClick={onVoiceCall} className="hidden sm:flex w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
            <Phone className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
          </button>
          <button onClick={onInfo} className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
            <Info className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
          </button>
          <div className="relative" ref={dropdownRef}>
            <button onClick={() => setShowDropdown(v=>!v)} className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
              <MoreVertical className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
            </button>
            {showDropdown && (
              <div className="absolute right-0 top-12 w-44 md:w-48 bg-white border border-[#e5e7eb] rounded-xl shadow-lg z-50">
                <button onClick={() => { onPinToggle?.(chat.id, !chat.isPinned); setShowDropdown(false) }} className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 first:rounded-t-xl">
                  {chat.isPinned ? <PinOff className="w-4 h-4 text-orange-500" /> : <Pin className="w-4 h-4 text-orange-500" />}
                  <span className="text-sm text-[#111111]">{chat.isPinned ? "Unpin Chat" : "Pin Chat"}</span>
                </button>
                <button onClick={() => { onMuteToggle?.(chat.id, !chat.isMuted); setShowDropdown(false) }} className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50">
                  {chat.isMuted ? <Volume2 className="w-4 h-4 text-green-600" /> : <VolumeX className="w-4 h-4 text-red-500" />}
                  <span className="text-sm text-[#111111]">{chat.isMuted ? "Unmute Chat" : "Mute Chat"}</span>
                </button>
                <button onClick={() => { onArchiveToggle?.(chat.id, !chat.isArchived); setShowDropdown(false) }} className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50">
                  {chat.isArchived ? <ArchiveRestore className="w-4 h-4 text-blue-600" /> : <Archive className="w-4 h-4 text-blue-600" />}
                  <span className="text-sm text-[#111111]">{chat.isArchived ? "Unarchive Chat" : "Archive Chat"}</span>
                </button>
                <button onClick={() => { setShowDropdown(false); setShowClearConfirm(true) }} className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 last:rounded-b-xl">
                  <Trash2 className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-[#111111]">Clear Chat</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={()=>setShowClearConfirm(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md" onClick={(e)=>e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-500/10 rounded-full flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h3 className="text-[#111111] font-semibold text-lg">Clear Chat</h3>
                <p className="text-gray-500 text-sm">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-gray-700 mb-6">Are you sure you want to permanently delete all messages in this chat?</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <button onClick={()=>setShowClearConfirm(false)} className="flex-1 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-[#111111]">Cancel</button>
              <button onClick={()=>{ onClearChat?.(); setShowClearConfirm(false) }} className="flex-1 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white">Clear Chat</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


