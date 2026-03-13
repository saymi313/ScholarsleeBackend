import { useState } from "react"
import { CheckCircle2, X } from "lucide-react"

const Toast = ({ message, onClose }) => {
    return (
        <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-4 shadow-2xl backdrop-blur-sm min-w-[300px]">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                    </div>
                    <p className="text-white font-medium flex-1">{message}</p>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Toast
