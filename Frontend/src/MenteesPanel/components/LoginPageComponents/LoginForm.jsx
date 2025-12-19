"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import LoginMethodToggle from "./LoginMethodToggle"
import InputField from "./InputField"
import RoleCheckbox from "./RoleCheckbox"
import SignInButton from "./SignInButton"
import GoogleSignInButton from "./GoogleSiginButton"
import { useAuth } from "../../../context/AuthContext"

export default function LoginForm() {
  const navigate = useNavigate()
  const { smartLogin } = useAuth() // Changed from login to smartLogin
  const [loginMethod, setLoginMethod] = useState("mobile")
  const [mobileNumber, setMobileNumber] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isMentor, setIsMentor] = useState(false)
  const [isStudent, setIsStudent] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const validatePassword = (pwd) => {
    // At least 8 characters, at least one letter and one number
    return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-={}|\[\]\\:";'<>?,.\/]{8,}$/.test(pwd)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // Validate required fields
      if (!password) {
        setError("Password is required.")
        return
      }

      // For email login, validate email
      if (loginMethod === "email" && !email) {
        setError("Email is required.")
        return
      }

      // For mobile login, validate mobile number
      if (loginMethod === "mobile" && !mobileNumber) {
        setError("Mobile number is required.")
        return
      }

      // Prepare login credentials
      const credentials = {
        password,
      }

      // Use email or mobile number based on login method
      if (loginMethod === "email") {
        credentials.email = email
      } else {
        // For mobile login, we'll use mobile number as email for now
        // In a real app, you'd have a separate mobile login endpoint
        credentials.email = mobileNumber
      }

      // Call the smart authentication service (auto-detects mentor vs mentee)
      const response = await smartLogin(credentials) // Changed from login to smartLogin
      console.log('LoginForm - Login response:', response);

      if (response.success) {
        // Navigate based on user role
        const userRole = response.user.role
        if (userRole === 'mentor') {
          navigate('/mentor/dashboard')
        } else {
          navigate('/home')
        }
      } else {
        setError(response.error || "Login failed. Please try again.")
      }
    } catch (error) {
      setError(error.message || "Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-[#1a1a1a] border border-[#5D38DE] rounded-2xl p-6 md:p-8 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-white font-['Poppins']">Sign in</h2>
          <p className="text-gray-400 text-sm font-['Poppins']">Please login to continue to your account.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Login Method Toggle */}
          <div className="space-y-3">
            <LoginMethodToggle loginMethod={loginMethod} setLoginMethod={setLoginMethod} />
          </div>

          {/* Mobile Number / Email Input */}
          {loginMethod === "mobile" ? (
            <InputField
              type="tel"
              placeholder="Mobile Number"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              icon={
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              }
            />
          ) : (
            <InputField
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              }
            />
          )}

          {/* Password Input */}
          <InputField
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            }
            rightIcon={
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="focus:outline-none">
                {showPassword ? (
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            }
          />

          {/* Forgot Password */}
          <div className="text-right">
            <Link to="/forgot-password" className="text-[#5D38DE] text-sm font-['Poppins'] hover:underline">
              forgot password?
            </Link>
          </div>

          {/* Role Selection */}
          <div className="flex items-center gap-6">
            <RoleCheckbox
              label="Mentor"
              checked={isMentor}
              onChange={(e) => {
                const next = e.target.checked
                setIsMentor(next)
                if (next) setIsStudent(false)
              }}
            />
            <RoleCheckbox
              label="Student"
              checked={isStudent}
              onChange={(e) => {
                const next = e.target.checked
                setIsStudent(next)
                if (next) setIsMentor(false)
              }}
            />
          </div>

          {/* Error message */}
          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          {/* Sign In Button */}
          <SignInButton loading={loading} disabled={loading} />

          {/* Google Sign In */}
          <GoogleSignInButton role={isMentor ? 'mentor' : isStudent ? 'mentee' : null} />

          {/* Create Account Link */}
          <div className="text-center pt-2">
            <p className="text-gray-400 text-sm font-['Poppins']">
              Need an account?{" "}
              <Link to="/signup" className="text-[#5D38DE] hover:underline font-medium">
                Sign Up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
