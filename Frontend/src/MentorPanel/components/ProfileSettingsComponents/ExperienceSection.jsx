"use client"

import { useState, useEffect } from "react"
import { Plus, Trash2, Briefcase } from "lucide-react"
import { profileAPI } from "../../../utils/api"
import Notification from "../Shared/Notification"

const ExperienceSection = () => {
  const [experiences, setExperiences] = useState([])
  const [loading, setLoading] = useState(false)
  const [notification, setNotification] = useState({ show: false, type: 'success', message: '' })
  const [hasChanges, setHasChanges] = useState(false)

  // Load experience data on component mount
  useEffect(() => {
    loadExperienceData()
  }, [])

  const loadExperienceData = async () => {
    try {
      console.log('🎓 Getting mentor profile for experience data...')
      const response = await profileAPI.mentor.get()
      console.log('🎓 Mentor profile response:', response.data)
      
      if (response.data.success && response.data.data.profile.experience) {
        // Transform backend data to frontend format
        const experienceData = response.data.data.profile.experience.map((exp, index) => ({
          id: index + 1,
          title: exp.position || '',
          company: exp.company || '',
          location: '', // Not in backend model
          startDate: exp.startDate ? new Date(exp.startDate).getFullYear().toString() : '',
          endDate: exp.endDate ? new Date(exp.endDate).getFullYear().toString() : (exp.isCurrent ? 'Present' : ''),
          description: exp.description || ''
        }))
        console.log('💼 Experience data loaded:', experienceData)
        setExperiences(experienceData)
      } else if (response.data.message && response.data.message.includes('not found')) {
        // Mentor profile doesn't exist yet, use empty array
        console.log('ℹ️ Mentor profile not found, using empty experience array')
        setExperiences([])
      }
    } catch (error) {
      console.error('Error loading experience data:', error)
      // Don't show error to user, just use empty array
      setExperiences([])
    }
  }

  const updateExperience = (id, field, value) => {
    setExperiences(experiences.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    ))
    setHasChanges(true)
  }

  const addExperience = () => {
    setExperiences([
      ...experiences,
      {
        id: Date.now(),
        title: "",
        company: "",
        location: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ])
    setHasChanges(true)
  }

  const removeExperience = (id) => {
    setExperiences(experiences.filter((exp) => exp.id !== id))
    setHasChanges(true)
  }

  const saveExperience = async () => {
    try {
      setLoading(true)
      
      const response = await mentorProfileService.updateProfile({
        experience: experiences
      })
      
      if (response.success) {
        setHasChanges(false)
        setNotification({
          show: true,
          type: 'success',
          message: 'Experience updated successfully!'
        })
      } else if (response.error && response.error.includes('not found')) {
        // Mentor profile doesn't exist, create it first
        const createResponse = await mentorProfileService.createProfile({
          title: 'Software Engineer', // Default title
          bio: 'Experienced software engineer with expertise in full-stack development and mentoring aspiring developers. Passionate about helping others grow in their careers and achieve their professional goals.',
          education: [],
          experience: experiences,
          achievements: [],
          socialLinks: {}
        })
        
        if (createResponse.success) {
          setHasChanges(false)
          setNotification({
            show: true,
            type: 'success',
            message: 'Experience saved successfully!'
          })
        } else {
          throw new Error(createResponse.error || 'Failed to create mentor profile')
        }
      } else {
        throw new Error(response.error || 'Failed to update experience')
      }
    } catch (error) {
      setNotification({
        show: true,
        type: 'error',
        message: error.message || 'Failed to save experience'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Notification
        type={notification.type}
        message={notification.message}
        isVisible={notification.show}
        onClose={() => setNotification({ show: false, type: 'success', message: '' })}
      />
      <div className="bg-[#1a1a1a] rounded-2xl p-4 sm:p-6 border border-[#2a2a2a]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#5D38DE]/20 rounded-lg flex items-center justify-center">
            <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-[#5D38DE]" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">Experience</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={addExperience}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-[#5D38DE] text-white rounded-lg hover:bg-[#4d2ec4] transition-colors text-sm sm:text-base"
          >
            <Plus className="w-4 h-4" />
            Add Experience
          </button>
          {hasChanges && (
            <button
              onClick={saveExperience}
              disabled={loading}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {experiences.map((exp) => (
          <div key={exp.id} className="bg-[#242424] rounded-xl p-4 sm:p-5 border border-[#3a3a3a] relative group">
            <button
              onClick={() => removeExperience(exp.id)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 sm:p-2 bg-red-500/20 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/30 z-10"
            >
              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pr-12 sm:pr-14">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Job Title</label>
                <input
                  type="text"
                  value={exp.title}
                  onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
                  className="w-full bg-[#1a1a1a] text-white rounded-lg p-3 border border-[#3a3a3a] focus:border-[#5D38DE] focus:outline-none text-sm sm:text-base"
                  placeholder="e.g., Senior Software Engineer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Company</label>
                <input
                  type="text"
                  value={exp.company}
                  onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                  className="w-full bg-[#1a1a1a] text-white rounded-lg p-3 border border-[#3a3a3a] focus:border-[#5D38DE] focus:outline-none text-sm sm:text-base"
                  placeholder="Company name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Location</label>
                <input
                  type="text"
                  value={exp.location}
                  onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                  className="w-full bg-[#1a1a1a] text-white rounded-lg p-3 border border-[#3a3a3a] focus:border-[#5D38DE] focus:outline-none text-sm sm:text-base"
                  placeholder="City, Country"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Start Date</label>
                  <input
                    type="text"
                    value={exp.startDate}
                    onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                    className="w-full bg-[#1a1a1a] text-white rounded-lg p-3 border border-[#3a3a3a] focus:border-[#5D38DE] focus:outline-none text-sm sm:text-base"
                    placeholder="YYYY"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">End Date</label>
                  <input
                    type="text"
                    value={exp.endDate}
                    onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                    className="w-full bg-[#1a1a1a] text-white rounded-lg p-3 border border-[#3a3a3a] focus:border-[#5D38DE] focus:outline-none text-sm sm:text-base"
                    placeholder="Present"
                  />
                </div>
              </div>
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                <textarea
                  value={exp.description}
                  onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                  className="w-full bg-[#1a1a1a] text-white rounded-lg p-3 border border-[#3a3a3a] focus:border-[#5D38DE] focus:outline-none min-h-[100px] resize-none"
                  placeholder="Describe your key responsibilities and achievements..."
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  )
}

export default ExperienceSection
