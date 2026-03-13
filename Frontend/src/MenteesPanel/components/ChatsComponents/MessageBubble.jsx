import React from "react"
import { Check, CheckCheck } from "lucide-react"
import NameAvatar from "../../../shared/components/NameAvatar"

export default function MessageBubble({ message }) {
  const isMe = message.sender === "me"
  const delivered = !!message.delivered
  const seen = !!message.seen

  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
      <div className="max-w-[85%] md:max-w-md">
        {!isMe && (
          <div className="flex items-center gap-2 mb-2">
            <NameAvatar src={message.avatar} name={message.senderName || 'Mentor'} size="w-6 h-6" textSize="text-xs" />
            <span className="text-gray-500 text-xs">Mentor</span>
          </div>
        )}
        <div className={`rounded-2xl px-4 py-3 ${isMe ? "bg-gray-100 text-[#111111]" : "bg-[#5D38DE] text-white"}`}>
          <p className="text-sm leading-relaxed">{message.text}</p>
        </div>

        {isMe && (
          <div className="flex items-center gap-1 mt-1 justify-end">
            {seen ? (
              <CheckCheck className="w-4 h-4 text-blue-500" />
            ) : delivered ? (
              <CheckCheck className="w-4 h-4 text-gray-400" />
            ) : (
              <Check className="w-4 h-4 text-gray-400" />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
