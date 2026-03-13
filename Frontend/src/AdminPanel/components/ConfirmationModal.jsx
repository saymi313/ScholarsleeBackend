"use client"
import React from "react"

export default function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    isDanger = false
}) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-md transform transition-all duration-200 ease-out scale-100 opacity-100">
                <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#171717] to-[#0f0f0f] shadow-2xl ring-1 ring-black/40">
                    {/* Glow accents */}
                    {isDanger && <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-red-500/10 blur-3xl" />}

                    <div className="p-6">
                        <div className="flex items-start gap-4">
                            <div className="relative shrink-0">
                                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ring-1 ring-inset shadow-[0_0_0_3px_rgba(0,0,0,0)] ${isDanger ? 'bg-red-500/15 ring-red-500/30' : 'bg-blue-500/15 ring-blue-500/30'}`}>
                                    {isDanger ? (
                                        <svg className="w-6 h-6 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                                        </svg>
                                    ) : (
                                        <svg className="w-6 h-6 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <line x1="12" y1="16" x2="12" y2="12"></line>
                                            <line x1="12" y1="8" x2="12.01" y2="8"></line>
                                        </svg>
                                    )}
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-semibold tracking-tight text-white">{title}</h3>
                                <p className="mt-2 text-sm leading-relaxed text-gray-300">
                                    {message}
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-3 sm:justify-end">
                            <button
                                className="inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium text-gray-200 bg-white/5 hover:bg-white/10 border border-white/10 transition"
                                onClick={onClose}
                            >
                                {cancelText}
                            </button>
                            <button
                                className={`inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium text-white shadow-lg transition ${isDanger ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-red-500/20' : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-blue-500/20'}`}
                                onClick={onConfirm}
                            >
                                {confirmText}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
