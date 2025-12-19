"use client"

import { useState, useEffect } from "react"

export default function PrivacyPolicyPopup({ isOpen, onClose, onAccept }) {
  const [timeRemaining, setTimeRemaining] = useState(30)
  const [canAccept, setCanAccept] = useState(false)

  // Timer effect when popup opens
  useEffect(() => {
    if (isOpen) {
      setTimeRemaining(3)
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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-4xl max-h-[90vh] transform transition-all duration-300 ease-out scale-100 opacity-100">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#171717] to-[#0f0f0f] shadow-2xl ring-1 ring-black/40">
          {/* Glow accents */}
          <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[#5D38DE]/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-fuchsia-500/10 blur-3xl" />

          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#5D38DE]/15 flex items-center justify-center ring-1 ring-inset ring-[#5D38DE]/30">
                <svg className="w-5 h-5 text-[#A78BFA]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12l2 2 4-4"></path>
                  <path d="M21 12c.552 0 1-.448 1-1V5c0-.552-.448-1-1-1H3c-.552 0-1 .448-1 1v6c0 .552.448 1 1 1h18z"></path>
                  <path d="M21 12v6c0 .552-.448 1-1 1H4c-.552 0-1-.448-1-1v-6"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white font-['Poppins']">Privacy Policy & Terms of Service</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="max-h-[60vh] overflow-y-auto px-6 py-4 space-y-6">
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 leading-relaxed mb-4">
                Last updated: {new Date().toLocaleDateString()}
              </p>

              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-bold text-red-400 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  Important Notice
                </h3>
                <p className="text-red-300 font-bold">
                  <strong>Any outsourced contact of mentees and mentors is not responsible by Scholarslee and such users will be banned immediately.</strong>
                </p>
                <p className="text-red-300 mt-2">
                  <strong>For mentees:</strong> If a mentor insists you to contact outside from this portal or requests money transfers outside our platform, please report them immediately on our contact page.
                </p>
              </div>

              <section className="mb-6">
                <h3 className="text-xl font-semibold text-white mb-3">1. Information We Collect</h3>
                <p className="text-gray-300 leading-relaxed mb-3">
                  We collect information you provide directly to us, such as when you create an account, complete your profile, book sessions, or communicate with us. This includes:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  <li>Personal information (name, email, phone number, nationality)</li>
                  <li>Profile information (bio, expertise areas, qualifications)</li>
                  <li>Communication data (messages, session recordings)</li>
                  <li>Payment information (processed securely through third-party providers)</li>
                </ul>
              </section>

              <section className="mb-6">
                <h3 className="text-xl font-semibold text-white mb-3">2. How We Use Your Information</h3>
                <p className="text-gray-300 leading-relaxed mb-3">
                  We use your information to:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  <li>Provide and improve our mentoring services</li>
                  <li>Process payments and transactions</li>
                  <li>Communicate with you about your account and our services</li>
                  <li>Ensure platform safety and prevent fraud</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section className="mb-6">
                <h3 className="text-xl font-semibold text-white mb-3">3. Platform Safety & Communication</h3>
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-4">
                  <p className="text-yellow-300 font-semibold mb-2">Communication Guidelines:</p>
                  <ul className="list-disc list-inside text-yellow-200 space-y-1 ml-4">
                    <li>All communications must occur within the Scholarslee platform</li>
                    <li>External contact requests are strictly prohibited</li>
                    <li>Money transfers outside our platform are not allowed</li>
                    <li>Report any suspicious behavior immediately</li>
                  </ul>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  We monitor communications to ensure compliance with our terms and to protect all users from potential scams or inappropriate behavior.
                </p>
              </section>

              <section className="mb-6">
                <h3 className="text-xl font-semibold text-white mb-3">4. Data Security</h3>
                <p className="text-gray-300 leading-relaxed mb-3">
                  We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  <li>Encrypted data transmission and storage</li>
                  <li>Regular security audits and updates</li>
                  <li>Limited access to personal information</li>
                  <li>Secure payment processing</li>
                </ul>
              </section>

              <section className="mb-6">
                <h3 className="text-xl font-semibold text-white mb-3">5. Your Rights</h3>
                <p className="text-gray-300 leading-relaxed mb-3">
                  You have the right to:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  <li>Access and update your personal information</li>
                  <li>Request deletion of your account and data</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Report privacy concerns or violations</li>
                </ul>
              </section>

              <section className="mb-6">
                <h3 className="text-xl font-semibold text-white mb-3">6. Third-Party Services</h3>
                <p className="text-gray-300 leading-relaxed">
                  We may use third-party services for payment processing, analytics, and communication. These services have their own privacy policies, and we encourage you to review them.
                </p>
              </section>

              <section className="mb-6">
                <h3 className="text-xl font-semibold text-white mb-3">7. Changes to This Policy</h3>
                <p className="text-gray-300 leading-relaxed">
                  We may update this privacy policy from time to time. We will notify you of any significant changes by email or through our platform.
                </p>
              </section>

              <section className="mb-6">
                <h3 className="text-xl font-semibold text-white mb-3">8. Contact Us</h3>
                <p className="text-gray-300 leading-relaxed">
                  If you have any questions about this privacy policy or our practices, please contact us through our contact page or at privacy@scholarslee.com.
                </p>
              </section>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-white/10 bg-black/20">
            {/* Timer Display */}
            <div className="flex items-center justify-center mb-4">
              <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#5D38DE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm text-gray-300">Reading time remaining:</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    timeRemaining > 10 
                      ? 'bg-[#5D38DE]/20 text-[#A78BFA]' 
                      : timeRemaining > 5 
                        ? 'bg-yellow-500/20 text-yellow-400' 
                        : 'bg-red-500/20 text-red-400'
                  }`}>
                    {timeRemaining}
                  </div>
                  <span className="text-xs text-gray-400">seconds</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={onClose}
                className="px-6 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors font-medium"
              >
                I am not interested
              </button>
              <button
                onClick={handleAccept}
                disabled={!canAccept}
                className={`px-6 py-2 rounded-lg font-medium transition-all shadow-lg ${
                  canAccept
                    ? 'bg-gradient-to-r from-[#5D38DE] to-[#8B5CF6] hover:from-[#4d2ec4] hover:to-[#7c3aed] text-white shadow-purple-500/20'
                    : 'bg-gray-500/20 text-gray-500 cursor-not-allowed'
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
