"use client"

import { useState, useEffect } from "react"
import { Camera, MapPin, Briefcase } from "lucide-react"
import { useAuth } from "../../../context/AuthContext"
import { profileAPI } from "../../../utils/api"

const ProfileHeader = () => {
  const { user } = useAuth()
  const [profileImage, setProfileImage] = useState("")
  const [profileData, setProfileData] = useState({
    name: "",
    title: "",
    location: ""
  })
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [loading, setLoading] = useState(false)
  const [notification, setNotification] = useState({ show: false, type: 'success', message: '' })
  const [profileCompletion, setProfileCompletion] = useState(0)

  // Load profile data on component mount
  useEffect(() => {
    loadProfileData()
  }, [])

  const loadProfileData = async () => {
    try {
      setLoadingProfile(true)

      // Load user profile data
      console.log('👤 Getting user profile data...')
      const userResponse = await profileAPI.user.get()
      console.log('👤 User profile response:', userResponse.data)

      let userData = null
      let mentorData = null

      if (userResponse.data.success) {
        userData = userResponse.data.data.user
        setProfileData(prev => ({
          ...prev,
          name: `${userData.profile.firstName} ${userData.profile.lastName}`,
          location: userData.profile.country || ''
        }))
        // Set profile image from user data
        if (userData.profile.avatar) {
          setProfileImage(userData.profile.avatar)
        }
      }

      // Load mentor profile data
      console.log('🎓 Getting mentor profile data...')
      const mentorResponse = await profileAPI.mentor.get()
      console.log('🎓 Mentor profile response:', mentorResponse.data)

      if (mentorResponse.data.success) {
        mentorData = mentorResponse.data.data.profile
        setProfileData(prev => ({
          ...prev,
          title: mentorData.title || ''
        }))
      }

      // Calculate profile completion
      calculateProfileCompletion(userData, mentorData)

    } catch (error) {
      console.error('Error loading profile data:', error)
    } finally {
      setLoadingProfile(false)
    }
  }

  // Calculate profile completion percentage
  const calculateProfileCompletion = (userData, mentorData) => {
    const fields = {
      name: userData?.profile?.firstName && userData?.profile?.lastName,
      avatar: userData?.profile?.avatar,
      location: userData?.profile?.country,
      title: mentorData?.title,
      bio: mentorData?.bio,
      education: mentorData?.education && mentorData.education.length > 0,
      experience: mentorData?.experience && mentorData.experience.length > 0,
      specializations: mentorData?.specializations && mentorData.specializations.length > 0,
    }

    const totalFields = Object.keys(fields).length
    const filledFields = Object.values(fields).filter(Boolean).length
    const percentage = Math.round((filledFields / totalFields) * 100)

    setProfileCompletion(percentage)
  }

  // Auto-dismiss notification
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification(prev => ({ ...prev, show: false }))
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [notification.show])

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (file) {
      // Show preview immediately
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result)
      }
      reader.readAsDataURL(file)

      // Upload to server
      try {
        const formData = new FormData()
        formData.append('avatar', file)

        console.log('Uploading avatar...')
        const response = await profileAPI.user.uploadAvatar(formData)

        if (response.data.success) {
          setProfileImage(response.data.fileUrl) // Use the returned Cloudinary URL
          setNotification({ show: true, type: 'success', message: 'Profile photo updated successfully' })
        }
      } catch (error) {
        console.error('Avatar upload failed:', error)
        setNotification({ show: true, type: 'error', message: "We couldn't upload your photo. Please use a JPG or PNG under 5MB." })
      }
    }
  }

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }))
    setHasChanges(true)
  }

  const handleSaveChanges = async () => {
    try {
      setLoading(true)

      // Extract name parts
      const nameParts = profileData.name.trim().split(' ')
      const firstName = nameParts[0] || ''
      const lastName = nameParts.slice(1).join(' ') || ''

      // 1. Update User Profile (Name & Location)
      // Backend expects 'country' at top level, not nested in profile
      const userUpdateData = {
        firstName,
        lastName,
        country: profileData.location
      }

      console.log('📝 Updating user profile:', userUpdateData)
      await profileAPI.user.update(userUpdateData)

      // 2. Update Mentor Profile (Title)
      if (profileData.title) {
        const mentorUpdateData = {
          title: profileData.title
        }
        console.log('🎓 Updating mentor profile:', mentorUpdateData)
        await profileAPI.mentor.update(mentorUpdateData)
      }

      setHasChanges(false)
      setIsEditing(false)
      setNotification({ show: true, type: 'success', message: 'Profile updated successfully' })

      // Reload data to ensure everything is synced
      loadProfileData()

    } catch (error) {
      console.error('Error saving profile:', error)
      setNotification({ show: true, type: 'error', message: "We couldn't save your changes. Please try again." })
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    // Reset to original values (simplified reload)
    loadProfileData()
    setHasChanges(false)
    setIsEditing(false)
  }

  if (loadingProfile) {
    return (
      <div className="bg-[#1a1a1a] rounded-2xl p-4 sm:p-6 md:p-8 border border-[#2a2a2a]">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5D38DE]"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      <div className="bg-[#1a1a1a] rounded-2xl p-4 sm:p-6 md:p-8 border border-[#2a2a2a]">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 sm:gap-6">
          {/* Profile Image */}
          <div className="relative group">
            <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-[#5D38DE] shadow-lg shadow-purple-500/20">
              <img
                src={profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.name)}&background=random&color=fff`}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <label className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <Camera className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
          </div>

          {/* Profile Info */}
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 bg-transparent border-b-2 border-[#5D38DE] focus:outline-none w-full"
              />
            ) : (
              <h1
                className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 cursor-pointer hover:text-[#5D38DE] transition-colors"
                onClick={() => setIsEditing(true)}
              >
                {profileData.name}
              </h1>
            )}
            <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-2 sm:gap-4 text-gray-400 mb-4">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 flex-shrink-0" />
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="bg-transparent border-b border-[#5D38DE] focus:outline-none text-gray-400 text-sm sm:text-base"
                    placeholder="Job title"
                  />
                ) : (
                  <span
                    className="cursor-pointer hover:text-white transition-colors text-sm sm:text-base"
                    onClick={() => setIsEditing(true)}
                  >
                    {profileData.title}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="bg-transparent border-b border-[#5D38DE] focus:outline-none text-gray-400 text-sm sm:text-base"
                    placeholder="Location"
                  />
                ) : (
                  <span
                    className="cursor-pointer hover:text-white transition-colors text-sm sm:text-base"
                    onClick={() => setIsEditing(true)}
                  >
                    {profileData.location}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                {isEditing || hasChanges ? (
                  <>
                    <button
                      onClick={handleSaveChanges}
                      disabled={loading}
                      className="px-4 sm:px-6 py-2 bg-[#5D38DE] text-white rounded-lg font-medium hover:bg-[#4d2ec4] transition-colors text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-4 sm:px-6 py-2 bg-[#242424] text-white rounded-lg font-medium hover:bg-[#2a2a2a] transition-colors border border-[#3a3a3a] text-sm sm:text-base"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 sm:px-6 py-2 bg-[#242424] text-white rounded-lg font-medium hover:bg-[#2a2a2a] transition-colors border border-[#3a3a3a] text-sm sm:text-base"
                  >
                    Edit Profile
                  </button>
                )}
              </div>

              {/* Success Message */}
              {notification.show && (
                <div className={`text-xs font-medium animate-fade-in transition-all duration-300 ${notification.type === 'error' ? 'text-red-400' : 'text-emerald-400'
                  }`}>
                  {notification.message}
                </div>
              )}
            </div>
          </div>

          {/* Profile Completion */}
          <div className="w-full lg:w-auto bg-[#242424] rounded-xl p-3 sm:p-4 border border-[#3a3a3a] lg:min-w-[120px]">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-[#5D38DE] mb-1">{profileCompletion}%</div>
              <div className="text-xs sm:text-sm text-gray-400">Profile Complete</div>
            </div>
            <div className="mt-2 sm:mt-3 w-full bg-[#1a1a1a] rounded-full h-1.5 sm:h-2">
              <div
                className="bg-gradient-to-r from-[#5D38DE] to-[#8b5cf6] h-1.5 sm:h-2 rounded-full transition-all duration-500"
                style={{ width: `${profileCompletion}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileHeader
