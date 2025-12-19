"use client"

import { useState } from "react"
import InputField from "../LoginPageComponents/InputField"
import RoleCheckbox from "../LoginPageComponents/RoleCheckbox"
import GoogleSignInButton from "../LoginPageComponents/GoogleSiginButton"
import PrivacyPolicyPopup from "./PrivacyPolicyPopup"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../../context/AuthContext"

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const nameRegex = /^[A-Za-z][A-Za-z\s'-]{1,49}$/
const phoneRegex = /^\+?[0-9]{7,15}$/
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-={}|\[\]\\:\";'<>?,.\/]{8,}$/

export default function SignUpForm() {
  const navigate = useNavigate()
  const { register, mentorRegister } = useAuth()
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    nationality: "",
    currentCountry: "",
  })
  const [errors, setErrors] = useState({})
  const [isMentor, setIsMentor] = useState(false)
  const [isStudent, setIsStudent] = useState(false)
  const [modal, setModal] = useState({ open: false, title: "", message: "" })
  const [privacyAccepted, setPrivacyAccepted] = useState(false)
  const [privacyPopupOpen, setPrivacyPopupOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const setField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  const validate = () => {
    const e = {}
    if (!(isMentor ^ isStudent)) e.role = "Select exactly one role"
    if (!nameRegex.test(form.firstName)) e.firstName = "Enter a valid first name"
    if (!nameRegex.test(form.lastName)) e.lastName = "Enter a valid last name"
    if (!emailRegex.test(form.email)) e.email = "Enter a valid email address"
    if (!phoneRegex.test(form.mobile)) e.mobile = "Enter a valid mobile number"
    if (!passwordRegex.test(form.password)) e.password = "Min 8 chars with letters and numbers"
    if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match"
    if (!privacyAccepted) e.privacy = "You must accept the privacy policy to continue"
    if (isMentor) {
      if (!form.nationality.trim()) e.nationality = "Nationality is required"
      if (!form.currentCountry.trim()) e.currentCountry = "Current country is required"
    }
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const v = validate()
    setErrors(v)
    if (Object.keys(v).length) {
      setLoading(false)
      return
    }

    try {
      // Prepare user data for registration
      const userData = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
      }

      // Call the appropriate registration function based on role
      const response = isMentor
        ? await mentorRegister(userData)
        : await register({ ...userData, role: "mentee" })

      if (response.success) {
        // Redirect ALL users (both mentor and mentee) to verification page
        navigate("/verify-email", { state: { email: form.email, role: isMentor ? "mentor" : "mentee" } });
        return;
      } else {
        setErrors({ general: response.error || "Registration failed. Please try again." })
      }
    } catch (error) {
      setErrors({ general: error.message || "Registration failed. Please try again." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-[#1a1a1a] border border-[#5D38DE] rounded-2xl p-6 md:p-8 space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-white font-['Poppins']">Create account</h2>
            <p className="text-gray-400 text-sm font-['Poppins']">Join Scholarslee to connect with mentors worldwide.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selection */}
            <div>
              <p className="text-gray-300 text-sm font-['Poppins'] mb-2">Sign up as</p>
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
              {errors.role && <p className="text-red-500 text-xs mt-2">{errors.role}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <InputField
                  type="text"
                  placeholder="First name"
                  value={form.firstName}
                  onChange={(e) => setField("firstName", e.target.value)}
                  icon={<svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A7 7 0 0112 15a7 7 0 016.879 2.804M15 11a3 3 0 11-6 0 3 3 0 016 0" /></svg>}
                />
                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <InputField
                  type="text"
                  placeholder="Last name"
                  value={form.lastName}
                  onChange={(e) => setField("lastName", e.target.value)}
                  icon={<svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A7 7 0 0112 15a7 7 0 016.879 2.804M15 11a3 3 0 11-6 0 3 3 0 016 0" /></svg>}
                />
                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <InputField
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => setField("email", e.target.value)}
                  icon={<svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12H8m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
              <div>
                <InputField
                  type="tel"
                  placeholder="Mobile number"
                  value={form.mobile}
                  onChange={(e) => setField("mobile", e.target.value)}
                  icon={<svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>}
                />
                {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
              </div>
            </div>

            {isMentor && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <InputField
                    type="text"
                    placeholder="Nationality"
                    value={form.nationality}
                    onChange={(e) => setField("nationality", e.target.value)}
                    icon={<svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2zm0 0l9 6 9-6" /></svg>}
                  />
                  {errors.nationality && <p className="text-red-500 text-xs mt-1">{errors.nationality}</p>}
                </div>
                <div>
                  <InputField
                    type="text"
                    placeholder="Current country"
                    value={form.currentCountry}
                    onChange={(e) => setField("currentCountry", e.target.value)}
                    icon={<svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C8.134 2 5 5.134 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.866-3.134-7-7-7z" /></svg>}
                  />
                  {errors.currentCountry && <p className="text-red-500 text-xs mt-1">{errors.currentCountry}</p>}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <InputField
                  type="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={(e) => setField("password", e.target.value)}
                  icon={<svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c1.657 0 3-1.567 3-3.5S13.657 4 12 4 9 5.567 9 7.5 10.343 11 12 11zm0 0v8m-6 0h12a2 2 0 002-2v-4a2 2 0 00-2-2H6a2 2 0 00-2 2v4a2 2 0 002 2z" /></svg>}
                />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>
              <div>
                <InputField
                  type="password"
                  placeholder="Confirm password"
                  value={form.confirmPassword}
                  onChange={(e) => setField("confirmPassword", e.target.value)}
                  icon={<svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c1.657 0 3-1.567 3-3.5S13.657 4 12 4 9 5.567 9 7.5 10.343 11 12 11zm0 0v8m-6 0h12a2 2 0 002-2v-4a2 2 0 00-2-2H6a2 2 0 00-2 2v4a2 2 0 002 2z" /></svg>}
                />
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>

            {/* Privacy Policy Checkbox */}
            <div className="flex items-start gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
              <input
                type="checkbox"
                id="privacy-checkbox"
                checked={privacyAccepted}
                onChange={(e) => {
                  if (e.target.checked) {
                    setPrivacyPopupOpen(true)
                  } else {
                    setPrivacyAccepted(false)
                  }
                }}
                className="mt-1 w-4 h-4 text-[#5D38DE] bg-white/10 border-white/20 rounded focus:ring-[#5D38DE] focus:ring-2"
              />
              <label htmlFor="privacy-checkbox" className="text-sm text-gray-300 leading-relaxed cursor-pointer">
                I agree to the{" "}
                <button
                  type="button"
                  onClick={() => setPrivacyPopupOpen(true)}
                  className="text-[#5D38DE] hover:text-[#4d2ec4] underline font-medium"
                >
                  Privacy Policy and Terms of Service
                </button>
                {" "}and understand that any external contact outside this platform will result in account termination.
              </label>
            </div>
            {errors.privacy && <p className="text-red-500 text-xs mt-1">{errors.privacy}</p>}

            {/* General error message */}
            {errors.general && (
              <div className="text-red-500 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                {errors.general}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full ${loading
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-[#5D38DE] hover:bg-[#4d2ec4]'
                } text-white font-medium py-3 rounded-lg transition-all duration-200 font-['Poppins']`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </div>
              ) : (
                'Sign up'
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-[#2a2a2a]" />
              <span className="text-xs text-gray-400">or continue with</span>
              <div className="flex-1 h-px bg-[#2a2a2a]" />
            </div>

            {/* Google Sign Up */}
            <GoogleSignInButton role={isMentor ? 'mentor' : isStudent ? 'mentee' : null} />
          </form>

          <div className="text-center pt-1">
            <p className="text-gray-400 text-sm font-['Poppins']">
              Already have an account? {""}
              <Link to="/login" className="text-[#5D38DE] hover:underline font-medium">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg transform transition-all duration-200 ease-out scale-100 opacity-100">
            <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-b from-[#171717] to-[#0f0f0f] shadow-2xl ring-1 ring-black/40">
              {/* Glow accents */}
              <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[#5D38DE]/10 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-fuchsia-500/10 blur-3xl" />

              <div className="p-6 md:p-8">
                {/* Icon + Title */}
                <div className="flex items-start gap-4">
                  <div className="relative shrink-0">
                    <div className="h-12 w-12 rounded-2xl bg-[#5D38DE]/15 flex items-center justify-center ring-1 ring-inset ring-[#5D38DE]/30 shadow-[0_0_0_3px_rgba(93,56,222,0.08)]">
                      <svg className="w-6 h-6 text-[#A78BFA]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12l2 2 4-4"></path><circle cx="12" cy="12" r="9"></circle></svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-semibold tracking-tight text-white">{modal.title}</h3>
                    <p className="mt-2 text-sm md:text-base leading-relaxed text-gray-300">{modal.message}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-7 flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-3 sm:justify-end">
                  <button
                    className="inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium text-gray-200 bg-white/5 hover:bg-white/10 border border-white/10 transition"
                    onClick={() => setModal({ open: false, title: "", message: "" })}
                  >
                    Stay here
                  </button>
                  <button
                    className="inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-[#5D38DE] to-[#8B5CF6] hover:from-[#4d2ec4] hover:to-[#7c3aed] shadow-lg shadow-purple-500/20 transition"
                    onClick={() => navigate('/login')}
                  >
                    Go to login
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Policy Popup */}
      <PrivacyPolicyPopup
        isOpen={privacyPopupOpen}
        onClose={() => setPrivacyPopupOpen(false)}
        onAccept={() => setPrivacyAccepted(true)}
      />
    </>
  )
}
