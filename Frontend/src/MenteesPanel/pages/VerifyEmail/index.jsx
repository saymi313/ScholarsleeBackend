"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import InputField from "../../components/LoginPageComponents/InputField"
import OTPInput from "../../components/ForgotPasswordComponents/OTPInput"
import { useAuth } from "../../../context/AuthContext"

export default function VerifyEmailPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { verifyEmail, resendVerificationEmail } = useAuth()
  
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [resendCooldown, setResendCooldown] = useState(0)

  useEffect(() => {
    // Get email from router state or query param
    const stateEmail = location.state?.email
    const queryEmail = new URLSearchParams(location.search).get("email")
    
    if (stateEmail) setEmail(stateEmail)
    else if (queryEmail) setEmail(queryEmail)
  }, [location])

  useEffect(() => {
    // Countdown timer for resend
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(c => c - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCooldown])

  const handleVerify = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    
    if (!email) {
      setError("Email is missing. please return to login.")
      return
    }
    
    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP code.")
      return
    }

    setLoading(true)
    try {
      const response = await verifyEmail(email, otp)
      
      if (response.success) {
        setSuccess("Email verified successfully! You are being redirected...")
        setTimeout(() => {
            // Check if user is mentor or mentee based on role in response, 
            // but usually we just redirect to dashboard or home.
            // Assuming response contains token/user, the auth context might handle state update.
            // Just redirect to login or dashboard.
            navigate("/dashboard") // Or wherever flow goes after login
        }, 2000)
      } else {
        setError(response.error || "Verification failed. Please check the code.")
      }
    } catch (err) {
      setError(err.message || "An error occurred during verification.")
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (resendCooldown > 0 || !email) return
    
    setError("")
    setSuccess("")
    
    try {
      const response = await resendVerificationEmail(email)
      if (response.success) {
        setSuccess("Verification code sent! Please check your email.")
        setResendCooldown(60) // 1 minute cooldown
      } else {
        setError(response.error || "Failed to resend code.")
      }
    } catch (err) {
      setError(err.message || "Failed to resend code.")
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 font-['Poppins']">
      <div className="w-full max-w-md bg-[#1a1a1a] border border-[#5D38DE] rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        
        {/* Glow Effects */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[#5D38DE]/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-fuchsia-500/10 blur-3xl" />
        
        <div className="relative z-10 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-white">Verify Your Email</h1>
            <p className="text-gray-400 text-sm">
              We've sent a verification code to{" "}
              <span className="text-white font-medium">{email || "your email"}</span>
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-center">
                <OTPInput 
                  length={6} 
                  value={otp} 
                  onChange={setOtp} 
                  disabled={loading} 
                />
              </div>
              
              {!email && (
                 <div className="px-4">
                    <InputField 
                        type="email" 
                        placeholder="Confirm your email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        icon={<svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12H8m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>}
                    />
                 </div>
              )}
            </div>

            {error && (
              <div className="text-red-500 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-center">
                {error}
              </div>
            )}

            {success && (
              <div className="text-green-500 text-sm bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-center">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || otp.length !== 6 || !email}
              className={`w-full py-3 rounded-xl font-medium text-white transition-all duration-200 ${
                loading || otp.length !== 6 || !email
                  ? "bg-gray-700 cursor-not-allowed opacity-70"
                  : "bg-gradient-to-r from-[#5D38DE] to-[#8B5CF6] hover:from-[#4d2ec4] hover:to-[#7c3aed] shadow-lg shadow-purple-500/20"
              }`}
            >
              {loading ? "Verifying..." : "Verify Email"}
            </button>
          </form>

          <div className="text-center">
            <p className="text-gray-400 text-sm">
              Didn't receive the code?{" "}
              <button
                type="button"
                onClick={handleResend}
                disabled={resendCooldown > 0 || loading}
                className={`font-medium transition ${
                  resendCooldown > 0
                    ? "text-gray-600 cursor-not-allowed"
                    : "text-[#5D38DE] hover:text-[#4d2ec4] hover:underline"
                }`}
              >
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend"}
              </button>
            </p>
          </div>
          
          <div className="text-center pt-4 border-t border-gray-800">
             <button 
                onClick={() => navigate("/login")}
                className="text-gray-500 hover:text-white text-sm flex items-center justify-center gap-2 mx-auto transition-colors"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                Back to Login
             </button>
          </div>
        </div>
      </div>
    </div>
  )
}
