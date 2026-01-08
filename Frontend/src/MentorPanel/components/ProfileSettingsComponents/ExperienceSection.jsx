"use client"

import { useState, useEffect, forwardRef, useImperativeHandle } from "react"
import { Plus, Trash2, Briefcase } from "lucide-react"
import { profileAPI } from "../../../utils/api"
import Notification from "../Shared/Notification"

const ExperienceSection = forwardRef((props, ref) => {
  const [experiences, setExperiences] = useState([])
  const [loading, setLoading] = useState(false)
  const [notification, setNotification] = useState({ show: false, type: 'success', message: '' })
  const [validationErrors, setValidationErrors] = useState({})

  // Expose getData method to parent
  useImperativeHandle(ref, () => ({
    getData: () => experiences
  }))

  // Validation function
  const validateField = (field, value, expId) => {
    const errors = { ...validationErrors }
    const key = `${expId}-${field}`

    switch (field) {
      case 'title':
        if (!value || value.trim() === '') {
          errors[key] = 'Job title is required'
        } else if (value.length < 2) {
          errors[key] = 'Title must be at least 2 characters'
        } else {
          delete errors[key]
        }
        break
      case 'company':
        if (!value || value.trim() === '') {
          errors[key] = 'Company name is required'
        } else if (value.length < 2) {
          errors[key] = 'Company must be at least 2 characters'
        } else {
          delete errors[key]
        }
        break
      case 'description':
        if (value && value.length > 500) {
          errors[key] = 'Description must be 500 characters or less'
        } else {
          delete errors[key]
        }
        break
      default:
        delete errors[key]
    }

    setValidationErrors(errors)
    return !errors[key]
  }

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
    // Validate field
    validateField(field, value, id)

    setExperiences(experiences.map(exp =>
      exp.id === id ? { ...exp, [field]: value } : exp
    ))
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
  }

  const removeExperience = (id) => {
    setExperiences(experiences.filter((exp) => exp.id !== id))
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
          <button
            onClick={addExperience}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-[#5D38DE] text-white rounded-lg hover:bg-[#4d2ec4] transition-colors text-sm sm:text-base"
          >
            <Plus className="w-4 h-4" />
            Add Experience
          </button>
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
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Job Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={exp.title}
                    onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
                    className={`w-full bg-[#1a1a1a] text-white rounded-lg p-3 border focus:outline-none text-sm sm:text-base transition-colors ${validationErrors[`${exp.id}-title`]
                      ? 'border-red-500 focus:border-red-500'
                      : exp.title && exp.title.length >= 2
                        ? 'border-green-500 focus:border-green-500'
                        : 'border-[#3a3a3a] focus:border-[#5D38DE]'
                      }`}
                    placeholder="e.g., Senior Software Engineer"
                  />
                  {validationErrors[`${exp.id}-title`] ? (
                    <p className="text-red-400 text-xs mt-1">{validationErrors[`${exp.id}-title`]}</p>
                  ) : (
                    <p className="text-gray-500 text-xs mt-1">Required: Your job position</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Company <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                    className={`w-full bg-[#1a1a1a] text-white rounded-lg p-3 border focus:outline-none text-sm sm:text-base transition-colors ${validationErrors[`${exp.id}-company`]
                      ? 'border-red-500 focus:border-red-500'
                      : exp.company && exp.company.length >= 2
                        ? 'border-green-500 focus:border-green-500'
                        : 'border-[#3a3a3a] focus:border-[#5D38DE]'
                      }`}
                    placeholder="Company name"
                  />
                  {validationErrors[`${exp.id}-company`] ? (
                    <p className="text-red-400 text-xs mt-1">{validationErrors[`${exp.id}-company`]}</p>
                  ) : (
                    <p className="text-gray-500 text-xs mt-1">Required: Company or organization name</p>
                  )}
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
                  <p className="text-gray-500 text-xs mt-1">Optional: Work location</p>
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
                    <p className="text-gray-500 text-xs mt-1">Optional: Year started (e.g., 2020)</p>
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
                    <p className="text-gray-500 text-xs mt-1">Optional: Year ended or "Present"</p>
                  </div>
                </div>
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                  <textarea
                    value={exp.description}
                    onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                    className={`w-full bg-[#1a1a1a] text-white rounded-lg p-3 border focus:outline-none min-h-[100px] resize-none transition-colors ${validationErrors[`${exp.id}-description`]
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-[#3a3a3a] focus:border-[#5D38DE]'
                      }`}
                    placeholder="Describe your key responsibilities and achievements..."
                  />
                  {validationErrors[`${exp.id}-description`] ? (
                    <p className="text-red-400 text-xs mt-1">{validationErrors[`${exp.id}-description`]}</p>
                  ) : (
                    <p className="text-gray-500 text-xs mt-1">Optional: Max 500 characters ({exp.description?.length || 0}/500)</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
})

ExperienceSection.displayName = 'ExperienceSection'

export default ExperienceSection
