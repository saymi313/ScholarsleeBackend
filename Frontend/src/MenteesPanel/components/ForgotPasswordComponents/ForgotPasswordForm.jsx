"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import InputField from "../LoginPageComponents/InputField"
import OTPInput from "./OTPInput"
import { authAPI } from "../../../utils/api"

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-={}|\[\]\\:";'<>?,.\/]{8,}$/

export default function ForgotPasswordForm() {
  const navigate = useNavigate()

  // Form state
  const [step, setStep] = useState(1) // 1: Email, 2: OTP, 3: Password Reset
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // UI state
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [successModal, setSuccessModal] = useState(false)

  // Timer state for OTP resend
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes in seconds
  const [canResend, setCanResend] = useState(false)

  // Countdown timer effect
  useEffect(() => {
    if (step === 2 && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setCanResend(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [step, timeLeft])

  // Format time for display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  // Mask email for display
  const maskEmail = (email) => {
    const [local, domain] = email.split("@")
    if (local.length <= 2) return email
    return `${local[0]}${"*".repeat(Math.min(local.length - 2, 5))}${local.slice(-1)}@${domain}`
  }

  // Step 1: Send OTP
  const handleSendOTP = async (e) => {
    e.preventDefault()
    setError("")

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address")
      return
    }

    setLoading(true)
    try {
      const response = await authAPI.forgotPassword(email)
      if (response.data.success) {
        setStep(2)
        setTimeLeft(300)
        setCanResend(false)
      }
    } catch (err) {
      setError(err.message || "We couldn't send the code. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Step 1 alternative: Resend OTP
  const handleResendOTP = async () => {
    if (!canResend) return
    setError("")
    setLoading(true)

    try {
      const response = await authAPI.forgotPassword(email)
      if (response.data.success) {
        setTimeLeft(300)
        setCanResend(false)
        setOtp("")
      }
    } catch (err) {
      setError(err.message || "We couldn't resend the code. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Step 2: Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    setError("")

    if (otp.length !== 4) {
      setError("Please enter the complete 4-digit code")
      return
    }

    setLoading(true)
    try {
      const response = await authAPI.verifyOTP(email, otp)
      if (response.data.success) {
        setStep(3)
      }
    } catch (err) {
      setError(err.message || "That code didn't work. Please double-check and try again.")
    } finally {
      setLoading(false)
    }
  }

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault()
    setError("")

    if (!passwordRegex.test(password)) {
      setError("Password must be at least 8 characters with letters and numbers")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)
    try {
      const response = await authAPI.resetPassword(email, password)
      if (response.data.success) {
        setSuccessModal(true)
      }
    } catch (err) {
      setError(err.message || "We couldn't reset your password. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Progress indicator
  const ProgressSteps = () => (
    <div className="flex items-center justify-center gap-2 mb-6">
      {[1, 2, 3].map((s) => (
        <div key={s} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${step >= s
              ? "bg-[#5D38DE] text-white"
              : "bg-gray-700 text-gray-400"
              }`}
          >
            {step > s ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              s
            )}
          </div>
          {s < 3 && (
            <div
              className={`w-12 h-0.5 mx-1 transition-all duration-300 ${step > s ? "bg-[#5D38DE]" : "bg-gray-700"
                }`}
            />
          )}
        </div>
      ))}
    </div>
  )

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-[#1a1a1a] border border-[#5D38DE] rounded-2xl p-6 md:p-8 space-y-6">
        <ProgressSteps />

        {/* Step 1: Enter Email */}
        {step === 1 && (
          <>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-white font-['Poppins']">Forgot password</h2>
              <p className="text-gray-400 text-sm font-['Poppins']">
                Enter your email address and we'll send you a verification code.
              </p>
            </div>

            <form onSubmit={handleSendOTP} className="space-y-4">
              <InputField
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                }
              />
              {error && <p className="text-red-500 text-xs">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className={`w-full ${loading ? "bg-gray-600 cursor-not-allowed" : "bg-[#5D38DE] hover:bg-[#4d2ec4]"
                  } text-white font-medium py-3 rounded-lg transition-all duration-200 font-['Poppins']`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Sending...
                  </div>
                ) : (
                  "Send verification code"
                )}
              </button>
            </form>
          </>
        )}

        {/* Step 2: Verify OTP */}
        {step === 2 && (
          <>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-white font-['Poppins']">Enter your code</h2>
              <p className="text-gray-400 text-sm font-['Poppins']">
                We've sent a 4-digit code to <span className="text-[#5D38DE]">{maskEmail(email)}</span>
              </p>
            </div>

            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <OTPInput value={otp} onChange={setOtp} disabled={loading} />

              {/* Timer */}
              <div className="text-center">
                {timeLeft > 0 ? (
                  <p className="text-gray-400 text-sm">
                    Code expires in <span className="text-[#5D38DE] font-medium">{formatTime(timeLeft)}</span>
                  </p>
                ) : (
                  <p className="text-red-400 text-sm">Code expired</p>
                )}
              </div>

              {error && <p className="text-red-500 text-xs text-center">{error}</p>}

              <button
                type="submit"
                disabled={loading || otp.length !== 4}
                className={`w-full ${loading || otp.length !== 4
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-[#5D38DE] hover:bg-[#4d2ec4]"
                  } text-white font-medium py-3 rounded-lg transition-all duration-200 font-['Poppins']`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Verifying...
                  </div>
                ) : (
                  "Verify code"
                )}
              </button>

              {/* Resend OTP */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={!canResend || loading}
                  className={`text-sm font-['Poppins'] ${canResend && !loading
                    ? "text-[#5D38DE] hover:underline cursor-pointer"
                    : "text-gray-500 cursor-not-allowed"
                    }`}
                >
                  {loading ? "Sending..." : "Resend code"}
                </button>
              </div>
            </form>

            {/* Back to email */}
            <button
              onClick={() => {
                setStep(1)
                setOtp("")
                setError("")
              }}
              className="flex items-center gap-2 text-gray-400 text-sm hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Change email
            </button>
          </>
        )}

        {/* Step 3: Reset Password */}
        {step === 3 && (
          <>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-white font-['Poppins']">Reset password</h2>
              <p className="text-gray-400 text-sm font-['Poppins']">
                Create a new password for your account.
              </p>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <InputField
                  type={showPassword ? "text" : "password"}
                  placeholder="New password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  icon={
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  }
                  rightIcon={
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="focus:outline-none">
                      {showPassword ? (
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  }
                />
                <p className="text-gray-500 text-xs mt-1">Min 8 chars with letters and numbers</p>
              </div>

              <InputField
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                icon={
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                }
                rightIcon={
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="focus:outline-none">
                    {showConfirmPassword ? (
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                }
              />

              {error && <p className="text-red-500 text-xs">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className={`w-full ${loading ? "bg-gray-600 cursor-not-allowed" : "bg-[#5D38DE] hover:bg-[#4d2ec4]"
                  } text-white font-medium py-3 rounded-lg transition-all duration-200 font-['Poppins']`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Resetting...
                  </div>
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>
          </>
        )}

        {/* Back to login link (always visible) */}
        <div className="text-center pt-1">
          <p className="text-gray-400 text-sm font-['Poppins']">
            Remember your password?{" "}
            <Link to="/login" className="text-[#5D38DE] hover:underline font-medium">
              Back to login
            </Link>
          </p>
        </div>
      </div>

      {/* Success Modal */}
      {successModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg transform transition-all duration-200 ease-out">
            <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-b from-[#171717] to-[#0f0f0f] shadow-2xl ring-1 ring-black/40">
              <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[#5D38DE]/10 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-fuchsia-500/10 blur-3xl" />
              <div className="p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-green-500/15 flex items-center justify-center ring-1 ring-inset ring-green-500/30">
                    <svg className="w-6 h-6 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 12l2 2 4-4" />
                      <circle cx="12" cy="12" r="9" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-semibold text-white">Password Reset Successful!</h3>
                    <p className="mt-2 text-sm md:text-base text-gray-300">
                      Your password has been successfully reset. You can now log in with your new password.
                    </p>
                  </div>
                </div>
                <div className="mt-7 flex justify-end gap-3">
                  <button
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#5D38DE] to-[#8B5CF6] text-white font-medium hover:from-[#4d2ec4] hover:to-[#7c3aed] shadow-lg shadow-purple-500/20 transition"
                    onClick={() => navigate("/login")}
                  >
                    Go to Login
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
