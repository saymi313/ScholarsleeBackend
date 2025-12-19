"use client"

import { useState, useEffect } from "react"

export default function ChatPrivacyPopup({ isOpen, onClose, onAccept }) {
  const [timeRemaining, setTimeRemaining] = useState(10)
  const [canAccept, setCanAccept] = useState(false)

  // Timer effect when popup opens
  useEffect(() => {
    if (isOpen) {
      setTimeRemaining(10)
      setCanAccept(false)
      
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setCanAccept(true)
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [isOpen])

  const handleAccept = () => {
    onAccept()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-80 p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg">
        <div className="relative overflow-hidden rounded-lg bg-white border border-gray-200">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#5D38DE]/15 flex items-center justify-center ring-1 ring-inset ring-[#5D38DE]/30">
                <svg className="w-5 h-5 text-[#5D38DE]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12l2 2 4-4"></path>
                  <path d="M21 12c.552 0 1-.448 1-1V5c0-.552-.448-1-1-1H3c-.552 0-1 .448-1 1v6c0 .552.448 1 1 1h18z"></path>
                  <path d="M21 12v6c0 .552-.448 1-1 1H4c-.552 0-1-.448-1-1v-6"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 font-['Poppins']">Chat Privacy Notice</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="max-h-[60vh] overflow-y-auto px-6 py-4 space-y-6">
            <div className="prose max-w-none">
              <p className="text-gray-600 leading-relaxed mb-4">
                Last updated: {new Date().toLocaleDateString()}
              </p>

              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-bold text-red-600 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  Important Notice
                </h3>
                <p className="text-red-700 font-bold mb-2">
                  <strong>Any outsourced contact of mentees and mentors is not responsible by Scholarslee and such users will be banned immediately.</strong>
                </p>
                <p className="text-red-600">
                  <strong>For mentees:</strong> If a mentor insists you to contact outside from this portal or requests money transfers outside our platform, please report them immediately on our contact page.
                </p>
              </div>

              <section className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Chat Safety Guidelines</h3>
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-4">
                  <p className="text-yellow-700 font-semibold mb-2">Communication Guidelines:</p>
                  <ul className="list-disc list-inside text-yellow-600 space-y-1 ml-4">
                    <li>All communications must occur within the Scholarslee platform</li>
                    <li>External contact requests are strictly prohibited</li>
                    <li>Money transfers outside our platform are not allowed</li>
                    <li>Report any suspicious behavior immediately</li>
                  </ul>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  We monitor communications to ensure compliance with our terms and to protect all users from potential scams or inappropriate behavior.
                </p>
              </section>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            {/* Timer Display */}
            <div className="flex items-center justify-center mb-4">
              <div className="flex items-center gap-3 px-4 py-2 bg-gray-100 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#5D38DE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm text-gray-600">Reading time remaining:</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    timeRemaining > 10 
                      ? 'bg-[#5D38DE]/20 text-[#5D38DE]' 
                      : timeRemaining > 5 
                        ? 'bg-yellow-500/20 text-yellow-600' 
                        : 'bg-red-500/20 text-red-600'
                  }`}>
                    {timeRemaining}
                  </div>
                  <span className="text-xs text-gray-500">seconds</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={onClose}
                className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 hover:text-gray-900 transition-colors font-medium"
              >
                I am not interested
              </button>
              <button
                onClick={handleAccept}
                disabled={!canAccept}
                className={`px-6 py-2 rounded-lg font-medium transition-all shadow-lg ${
                  canAccept
                    ? 'bg-gradient-to-r from-[#5D38DE] to-[#8B5CF6] hover:from-[#4d2ec4] hover:to-[#7c3aed] text-white shadow-purple-500/20'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {canAccept ? 'I have read and agree' : `Please wait ${timeRemaining}s`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
