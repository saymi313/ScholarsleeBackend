"use client"
import React from "react"
import { X, Construction } from "lucide-react"

export default function FeatureComingSoonModal({ feature, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-[#2a2a2a] rounded-2xl p-8 w-full max-w-md mx-4 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-[#333333] flex items-center justify-center hover:bg-[#3a3a3a] transition-colors"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>

        <div className="w-16 h-16 bg-[#5D38DE]/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Construction className="w-8 h-8 text-[#5D38DE]" />
        </div>

        <h2 className="text-2xl font-semibold text-white mb-3">Feature Under Construction</h2>
        <p className="text-gray-400 mb-6">
          {feature} is currently under construction and will be built in the next iteration.
        </p>

        <button
          onClick={onClose}
          className="w-full bg-[#5D38DE] text-white py-3 rounded-lg font-medium hover:bg-[#6d48ee] transition-colors"
        >
          Got it
        </button>
      </div>
    </div>
  )
}
