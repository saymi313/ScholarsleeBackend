"use client"
import React from "react"
import { X } from "lucide-react"

export default function DeliveryStatusModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-[#2a2a2a] rounded-2xl p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Message Delivery</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#333333] flex items-center justify-center hover:bg-[#3a3a3a] transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              <div className="w-6 h-6 rounded-full bg-[#5D38DE]" />
              <div className="w-6 h-6 rounded-full bg-[#5D38DE]" />
            </div>
            <span className="text-white">Delivered & seen</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              <div className="w-6 h-6 rounded-full bg-[#5D38DE]" />
              <div className="w-6 h-6 rounded-full bg-white" />
            </div>
            <span className="text-white">Delivered & not seen</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              <div className="w-6 h-6 rounded-full bg-white" />
              <div className="w-6 h-6 rounded-full bg-white" />
            </div>
            <span className="text-white">Not delivered & not seen</span>
          </div>
        </div>
      </div>
    </div>
  )
}
