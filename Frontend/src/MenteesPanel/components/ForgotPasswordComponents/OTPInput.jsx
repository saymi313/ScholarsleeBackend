"use client"

import { useRef, useState, useEffect } from "react"

export default function OTPInput({ length = 4, value = "", onChange, disabled = false }) {
  const [otp, setOtp] = useState(new Array(length).fill(""))
  const inputRefs = useRef([])

  // Sync internal state with external value
  useEffect(() => {
    if (value) {
      const otpArray = value.split("").slice(0, length)
      while (otpArray.length < length) {
        otpArray.push("")
      }
      setOtp(otpArray)
    }
  }, [value, length])

  const handleChange = (element, index) => {
    if (isNaN(Number(element.value))) return

    const newOtp = [...otp]
    newOtp[index] = element.value.substring(element.value.length - 1)
    setOtp(newOtp)

    // Call onChange with combined OTP
    const combinedOtp = newOtp.join("")
    onChange(combinedOtp)

    // Move to next input if current field is filled
    if (element.value && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (e, index) => {
    // Move to previous input on backspace if current field is empty
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    
    // Handle arrow keys
    if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault()
      inputRefs.current[index - 1]?.focus()
    }
    if (e.key === "ArrowRight" && index < length - 1) {
      e.preventDefault()
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text/plain").trim()
    
    // Only use numeric characters
    const numericData = pastedData.replace(/\D/g, "").slice(0, length)
    
    if (numericData) {
      const newOtp = numericData.split("")
      while (newOtp.length < length) {
        newOtp.push("")
      }
      setOtp(newOtp)
      onChange(numericData)
      
      // Focus last filled input or the next empty one
      const focusIndex = Math.min(numericData.length, length - 1)
      inputRefs.current[focusIndex]?.focus()
    }
  }

  const handleFocus = (e) => {
    e.target.select()
  }

  return (
    <div className="flex justify-center gap-3">
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(ref) => (inputRefs.current[index] = ref)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(e.target, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          onFocus={handleFocus}
          disabled={disabled}
          className={`
            w-14 h-16 text-center text-2xl font-bold
            bg-[#0a0a0a] border-2 rounded-xl
            text-white placeholder-gray-600
            focus:outline-none focus:border-[#5D38DE] focus:ring-2 focus:ring-[#5D38DE]/20
            transition-all duration-200 font-['Poppins']
            ${digit ? "border-[#5D38DE]" : "border-gray-700"}
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          `}
          aria-label={`OTP digit ${index + 1}`}
        />
      ))}
    </div>
  )
}

