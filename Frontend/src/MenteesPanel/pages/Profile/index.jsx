"use client"

import React, { useEffect, useMemo, useState, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { createPortal } from "react-dom"
import { useAuth } from "../../../context/AuthContext"
import Header from "../../components/Shared/Header"
import SectionCard from "../../components/Profile/SectionCard"
import AvatarUploader from "../../components/Profile/AvatarUploader"
import BasicInfoForm from "../../components/Profile/BasicInfoForm"
import ContactForm from "../../components/Profile/ContactForm"
import PreferencesForm from "../../components/Profile/PreferencesForm"
import EducationLevelForm from "../../components/Profile/EducationLevelForm"
import StudyGoalsForm from "../../components/Profile/StudyGoalsForm"
import TargetCountriesForm from "../../components/Profile/TargetCountriesForm"
import BudgetForm from "../../components/Profile/BudgetForm"
import AcademicInterestsForm from "../../components/Profile/AcademicInterestsForm"
import CareerGoalsForm from "../../components/Profile/CareerGoalsForm"
import TimelineForm from "../../components/Profile/TimelineForm"
import PreviousExperienceForm from "../../components/Profile/PreviousExperienceForm"
import ChallengesForm from "../../components/Profile/ChallengesForm"
import SaveBar from "../../components/Profile/SaveBar"
import LoginRequiredError from "../../components/Profile/LoginRequiredError"
import { profileAPI } from "../../../utils/api"

export default function ProfilePage() {
  const navigate = useNavigate()
  const { isAuthenticated, user, loading: authLoading } = useAuth()
  
  const [profile, setProfile] = useState({
    avatar: "/u.jpeg",
    fullName: "",
    headline: "",
    location: "",
    email: "",
    phone: "",
    website: "",
    linkedin: "",
    preferences: { notifications: true, publicProfile: true, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone },
    // New mentee-specific fields
    educationLevel: "",
    currentInstitution: "",
    studyGoals: [],
    targetCountries: [],
    budget: 0,
    budgetCurrency: "USD",
    academicInterests: [],
    careerGoals: [],
    timeline: "",
    previousExperience: "",
    challenges: []
  })
  const [dirty, setDirty] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [profileCompleteness, setProfileCompleteness] = useState(0)
  const [profileLoaded, setProfileLoaded] = useState(false)
  const [missingFields, setMissingFields] = useState([])

  const isValid = useMemo(() => {
    return (
      profile.fullName.trim().length > 1 &&
      profile.headline.trim().length > 1 &&
      profile.location.trim().length > 1 &&
      /.+@.+\..+/.test(profile.email) &&
      profile.educationLevel.trim().length > 0 &&
      profile.timeline.trim().length > 0
    )
  }, [profile])

  // Load profile data when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user && !profileLoaded) {
      loadProfileData()
    }
  }, [isAuthenticated, user, profileLoaded])

  useEffect(() => {
    const onBeforeUnload = (e) => {
      if (dirty) {
        e.preventDefault()
        e.returnValue = ""
      }
    }
    window.addEventListener("beforeunload", onBeforeUnload)
    return () => window.removeEventListener("beforeunload", onBeforeUnload)
  }, [dirty])

  const loadProfileData = async () => {
    try {
      // Prevent multiple calls
      if (profileLoaded) {
        return
      }
      
      setLoading(true)
      setError('')
      
      // Check if user is authenticated
      if (!isAuthenticated || !user) {
        setError('Please login to access your profile')
        setLoading(false)
        // Redirect to login after a short delay
        setTimeout(() => {
          navigate('/login')
        }, 2000)
        return
      }
      
      // Load complete profile data from single API endpoint
      console.log('📖 Getting mentee profile data...')
      const profileResponse = await profileAPI.mentee.get()
      console.log('📖 Get response:', profileResponse.data)
      
      if (profileResponse.data.success) {
        const menteeData = profileResponse.data.data.profile
        
        // Get user data from AuthContext (already available)
        const userData = user
        
        setProfile(prev => ({
          ...prev,
          // User profile fields from AuthContext
          fullName: `${userData.profile?.firstName || ''} ${userData.profile?.lastName || ''}`.trim(),
          email: userData.email || '',
          phone: userData.profile?.phone || '',
          location: userData.profile?.country || '',
          avatar: userData.profile?.avatar || '/u.jpeg',
          preferences: {
            ...prev.preferences,
            timezone: userData.profile?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone
          },
          // Mentee profile fields from API
          headline: menteeData.educationLevel || '',
          website: menteeData.socialLinks?.website || '',
          linkedin: menteeData.socialLinks?.linkedin || '',
          educationLevel: menteeData.educationLevel || '',
          currentInstitution: menteeData.currentInstitution || '',
          studyGoals: (menteeData.studyGoals || []).map((goal, index) => ({ text: goal, type: 'academic', id: Date.now() + index })),
          targetCountries: menteeData.targetCountries || [],
          budget: menteeData.budget || 0,
          budgetCurrency: menteeData.budgetCurrency || 'USD',
          academicInterests: menteeData.academicInterests || [],
          careerGoals: (menteeData.careerGoals || []).map((goal, index) => ({ text: goal, type: 'professional', id: Date.now() + index })),
          timeline: menteeData.timeline || '',
          previousExperience: menteeData.previousExperience || '',
          challenges: (menteeData.challenges || []).map((challenge, index) => ({ text: challenge, type: 'academic', id: Date.now() + index }))
        }))
      } else if (profileResponse.data.message && profileResponse.data.message.includes('not found')) {
        // Profile doesn't exist yet, this is normal for new users
      } else {
        console.error('Failed to load mentee profile:', profileResponse.data.message)
        setError('Failed to load profile data')
      }
    } catch (error) {
      if (error.message.includes('Unauthorized') || error.message.includes('401')) {
        setError('login_required')
      } else if (error.message.includes('404') || error.message.includes('not found')) {
        // Profile not found, this is normal for new users
        setLoading(false)
      } else {
        setError('Failed to load profile data')
      }
    } finally {
      setLoading(false)
      setProfileLoaded(true)
    }
  }

  const update = (patch) => {
    setProfile((p) => ({ ...p, ...patch }))
    setDirty(true)
  }

  // Calculate profile completeness
  const calculateCompleteness = useCallback((profileData) => {
    let completeness = 0
    const fields = [
      'educationLevel',
      'studyGoals',
      'targetCountries',
      'academicInterests',
      'careerGoals',
      'timeline',
      'previousExperience',
      'challenges'
    ]
    
    const missing = []
    
    fields.forEach(field => {
      if (profileData[field] && (Array.isArray(profileData[field]) ? profileData[field].length > 0 : profileData[field].trim())) {
        completeness += (100 / fields.length)
      } else {
        missing.push(field)
      }
    })
    
    return {
      completeness: Math.round(completeness),
      missingFields: missing
    }
  }, [])

  // Update completeness when profile changes
  useEffect(() => {
    const { completeness, missingFields } = calculateCompleteness(profile)
    setProfileCompleteness(completeness)
    setMissingFields(missingFields)
  }, [profile, calculateCompleteness])

  const handleSave = async () => {
    if (!isValid) return
    setSaving(true)
    setError('')
    
    try {
      // Extract name parts
      const nameParts = profile.fullName.trim().split(' ')
      const firstName = nameParts[0] || ''
      const lastName = nameParts.slice(1).join(' ') || ''
      
      // Update user profile
      const userData = {
        firstName,
        lastName,
        phone: profile.phone,
        country: profile.location,
        timezone: profile.preferences.timezone
      }
      
      console.log('👤 Updating user profile:', userData)
      const userResponse = await profileAPI.user.update(userData)
      console.log('👤 User update response:', userResponse.data)
      
      if (!userResponse.data.success) {
        throw new Error(userResponse.data.message || 'Failed to update user profile')
      }

      // Update mentee profile
      const menteeData = {
        educationLevel: profile.educationLevel,
        currentInstitution: profile.currentInstitution,
        studyGoals: profile.studyGoals.map(goal => goal.text), // Convert objects to strings
        targetCountries: profile.targetCountries, // Already strings
        budget: profile.budget,
        budgetCurrency: profile.budgetCurrency,
        academicInterests: profile.academicInterests, // Already strings
        careerGoals: profile.careerGoals.map(goal => goal.text), // Convert objects to strings
        timeline: profile.timeline,
        previousExperience: profile.previousExperience,
        challenges: profile.challenges.map(challenge => challenge.text), // Convert objects to strings
        socialLinks: {
          website: profile.website,
          linkedin: profile.linkedin
        }
      }
      
      console.log('🎓 Updating mentee profile:', menteeData)
      const menteeResponse = await profileAPI.mentee.update(menteeData)
      console.log('🎓 Mentee update response:', menteeResponse.data)
      
      if (!menteeResponse.data.success) {
        // If mentee profile doesn't exist, create it first
        if (menteeResponse.data.message && (menteeResponse.data.message.includes('not found') || menteeResponse.data.message.includes('404'))) {
          console.log('🆕 Creating new mentee profile...')
          const createResponse = await profileAPI.mentee.create({
            educationLevel: profile.educationLevel,
            currentInstitution: profile.currentInstitution,
            studyGoals: profile.studyGoals.map(goal => goal.text),
            targetCountries: profile.targetCountries,
            budget: profile.budget,
            budgetCurrency: profile.budgetCurrency,
            academicInterests: profile.academicInterests,
            careerGoals: profile.careerGoals.map(goal => goal.text),
            timeline: profile.timeline,
            previousExperience: profile.previousExperience,
            challenges: profile.challenges.map(challenge => challenge.text),
            preferences: {
              mentorGender: 'Any',
              communicationStyle: 'Mixed',
              preferredLanguage: 'English',
              timezone: profile.preferences.timezone || 'UTC'
            }
          })
          console.log('🆕 Create response:', createResponse.data)
          
          if (!createResponse.data.success) {
            // If profile already exists, try to update it instead
            if (createResponse.data.message && createResponse.data.message.includes('already exists')) {
              console.log('🔄 Profile already exists, updating instead...')
              const updateResponse = await profileAPI.mentee.update(menteeData)
              console.log('🔄 Update response:', updateResponse.data)
              if (!updateResponse.data.success) {
                throw new Error(updateResponse.data.message || 'Failed to update existing mentee profile')
              }
            } else {
              throw new Error(createResponse.data.message || 'Failed to create mentee profile')
            }
          }
        } else {
          throw new Error(menteeResponse.data.message || 'Failed to update mentee profile')
        }
      }

      setDirty(false)
      setSuccessMessage("Profile saved successfully! 🎉")
    } catch (error) {
      setError(error.message || 'Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    if (dirty && !confirm("Discard unsaved changes?")) return
    window.history.back()
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 text-[#111111] font-['Poppins'] overflow-x-hidden">
        <Header />
        <main className="max-w-6xl mx-auto p-2 sm:p-4 md:p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5D38DE]"></div>
          </div>
        </main>
      </div>
    )
  }

  if (error === 'login_required') {
    return <LoginRequiredError />
  }


  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 text-[#111111] font-['Poppins'] overflow-x-hidden">
        <Header />
        <main className="max-w-6xl mx-auto p-2 sm:p-4 md:p-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Profile</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={loadProfileData}
              className="px-4 py-2 bg-[#5D38DE] text-white rounded hover:bg-[#4d2ec4] transition-colors"
            >
              Try Again
            </button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 text-[#111111] font-['Poppins'] overflow-x-hidden">
      <Header />
      <main className="max-w-6xl mx-auto p-2 sm:p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Left/Main column */}
          <div className="lg:col-span-2 min-w-0 space-y-4 md:space-y-6">
            <SectionCard title="Profile Photo" description="Upload a clear, friendly photo.">
              <AvatarUploader value={profile.avatar} onChange={(avatar) => update({ avatar })} />
            </SectionCard>

            <SectionCard title="Basic Information" description="Tell others who you are." required>
              <BasicInfoForm value={profile} onChange={update} />
            </SectionCard>

            <SectionCard title="Contact" description="How mentees can reach you." required>
              <ContactForm value={profile} onChange={update} />
            </SectionCard>


            <SectionCard title="Education Level" description="Your current education status." required>
              <EducationLevelForm 
                value={{ educationLevel: profile.educationLevel, currentInstitution: profile.currentInstitution }} 
                onChange={(data) => update(data)} 
              />
            </SectionCard>

            <SectionCard title="Study Goals" description="What do you want to achieve?">
              <StudyGoalsForm value={profile.studyGoals} onChange={(studyGoals) => update({ studyGoals })} />
            </SectionCard>

            <SectionCard title="Target Countries" description="Where do you want to study or work?">
              <TargetCountriesForm value={profile.targetCountries} onChange={(targetCountries) => update({ targetCountries })} />
            </SectionCard>

            <SectionCard title="Budget & Currency" description="Your financial capacity for mentoring.">
              <BudgetForm 
                value={{ budget: profile.budget, budgetCurrency: profile.budgetCurrency }} 
                onChange={(data) => update(data)} 
              />
            </SectionCard>

            <SectionCard title="Academic Interests" description="Subjects and fields you're interested in.">
              <AcademicInterestsForm value={profile.academicInterests} onChange={(academicInterests) => update({ academicInterests })} />
            </SectionCard>

            <SectionCard title="Career Goals" description="Your professional aspirations.">
              <CareerGoalsForm value={profile.careerGoals} onChange={(careerGoals) => update({ careerGoals })} />
            </SectionCard>

            <SectionCard title="Study Timeline" description="When do you want to start?" required>
              <TimelineForm 
                value={{ timeline: profile.timeline }} 
                onChange={(data) => update(data)} 
              />
            </SectionCard>

            <SectionCard title="Previous Experience" description="Your background and experience.">
              <PreviousExperienceForm 
                value={{ previousExperience: profile.previousExperience }} 
                onChange={(data) => update(data)} 
              />
            </SectionCard>

            <SectionCard title="Challenges" description="What challenges are you facing?">
              <ChallengesForm value={profile.challenges} onChange={(challenges) => update({ challenges })} />
            </SectionCard>
          </div>

          {/* Right/Aside column */}
          <aside className="lg:col-span-1 space-y-4 md:space-y-6 min-w-0">
            <SectionCard title="Preferences" description="Control visibility and notifications.">
              <PreferencesForm value={profile.preferences} onChange={(preferences) => update({ preferences })} />
            </SectionCard>

            <SectionCard title="Profile Completeness" description="Complete your profile to get better matches.">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Profile Complete</span>
                  <span className="text-sm font-semibold text-[#5D38DE]">{profileCompleteness}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-[#5D38DE] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${profileCompleteness}%` }}
                  ></div>
                </div>
                {missingFields.length > 0 && (
                  <div className="text-xs text-gray-500">
                    <p className="mb-1">Missing fields:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {missingFields.map(field => (
                        <li key={field} className="capitalize">
                          {field.replace(/([A-Z])/g, ' $1').toLowerCase()}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {profileCompleteness === 100 && (
                  <div className="text-xs text-green-600 font-medium">
                    🎉 Your profile is complete!
                  </div>
                )}
              </div>
            </SectionCard>

            <SectionCard title="Preview" description="What mentees will see.">
              <div className="flex items-center gap-3">
                <img src={profile.avatar || "/u.jpeg"} alt="avatar" className="w-12 h-12 rounded-full border" />
                <div className="min-w-0">
                  <h4 className="font-semibold truncate">{profile.fullName || "Your Name"}</h4>
                  <p className="text-sm text-gray-500 truncate">{profile.headline || "Headline / Role"}</p>
                  <p className="text-xs text-gray-400 truncate">{profile.location || "Location"}</p>
                </div>
              </div>
              {!!profile.skills?.length && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {profile.skills.slice(0, 6).map((s, i) => (
                    <span key={i} className="px-2 py-1 rounded-full bg-gray-100 text-xs text-gray-700 border">{s}</span>
                  ))}
                </div>
              )}
            </SectionCard>
          </aside>
        </div>
      </main>

      <SaveBar dirty={dirty} saving={saving} valid={isValid} onSave={handleSave} onCancel={handleCancel} />

      {/* Success Popup */}
      {/* Success Popup */}
      {successMessage && createPortal(
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md p-4" style={{ zIndex: 9999 }}>
          <div className="w-full max-w-lg transform transition-all duration-500 ease-out scale-100 opacity-100">
            <div className="relative overflow-hidden rounded-3xl border border-gray-200/50 bg-white/95 shadow-2xl ring-1 ring-gray-200/50 backdrop-blur-xl">
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-green-50 opacity-80" />
              
              {/* Floating particles effect */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-4 -right-4 h-8 w-8 rounded-full bg-emerald-400/20 animate-pulse" />
                <div className="absolute top-1/4 -left-2 h-4 w-4 rounded-full bg-green-400/30 animate-bounce" style={{ animationDelay: '0.5s' }} />
                <div className="absolute bottom-1/4 -right-2 h-6 w-6 rounded-full bg-emerald-300/25 animate-pulse" style={{ animationDelay: '1s' }} />
              </div>
              
              <div className="relative p-8">
                {/* Success Icon with animation */}
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="h-20 w-20 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center shadow-lg shadow-emerald-500/25 animate-bounce">
                      <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 12l2 2 4-4"></path>
                        <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"></path>
                      </svg>
                    </div>
                    {/* Ripple effect */}
                    <div className="absolute inset-0 rounded-full bg-emerald-400/30 animate-ping" />
                  </div>
                </div>

                {/* Content */}
                <div className="text-center space-y-4">
                  <h3 className="text-2xl font-bold text-gray-900">Excellent Work!</h3>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    {successMessage}
                  </p>
                  <p className="text-sm text-gray-500">
                    Your profile has been updated and saved successfully.
                  </p>
                </div>

                {/* Action Button */}
                <div className="mt-8 flex justify-center">
                  <button
                    className="group relative inline-flex items-center justify-center rounded-2xl px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-emerald-500/20"
                    onClick={() => setSuccessMessage('')}
                  >
                    <span className="relative z-10">Continue</span>
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Error Popup */}
      {error && createPortal(
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md p-4" style={{ zIndex: 9999 }}>
          <div className="w-full max-w-lg transform transition-all duration-500 ease-out scale-100 opacity-100">
            <div className="relative overflow-hidden rounded-3xl border border-gray-200/50 bg-white/95 shadow-2xl ring-1 ring-gray-200/50 backdrop-blur-xl">
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-white to-rose-50 opacity-80" />
              
              {/* Floating particles effect */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-4 -right-4 h-8 w-8 rounded-full bg-red-400/20 animate-pulse" />
                <div className="absolute top-1/4 -left-2 h-4 w-4 rounded-full bg-rose-400/30 animate-bounce" style={{ animationDelay: '0.5s' }} />
                <div className="absolute bottom-1/4 -right-2 h-6 w-6 rounded-full bg-red-300/25 animate-pulse" style={{ animationDelay: '1s' }} />
              </div>
              
              <div className="relative p-8">
                {/* Error Icon with animation */}
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="h-20 w-20 rounded-full bg-gradient-to-br from-red-400 to-rose-500 flex items-center justify-center shadow-lg shadow-red-500/25 animate-bounce">
                      <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                      </svg>
                    </div>
                    {/* Ripple effect */}
                    <div className="absolute inset-0 rounded-full bg-red-400/30 animate-ping" />
                  </div>
                </div>

                {/* Content */}
                <div className="text-center space-y-4">
                  <h3 className="text-2xl font-bold text-gray-900">Oops! Something went wrong</h3>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    {error}
                  </p>
                  <p className="text-sm text-gray-500">
                    Please try again or contact support if the problem persists.
                  </p>
                </div>

                {/* Action Button */}
                <div className="mt-8 flex justify-center">
                  <button
                    className="group relative inline-flex items-center justify-center rounded-2xl px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-500/20"
                    onClick={() => setError('')}
                  >
                    <span className="relative z-10">Try Again</span>
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-600 to-rose-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}


