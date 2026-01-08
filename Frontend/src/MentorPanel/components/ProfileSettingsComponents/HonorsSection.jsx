"use client"

import { useState, useEffect, forwardRef, useImperativeHandle } from "react"
import { Plus, Trash2, Award } from "lucide-react"
import { mentorProfileAPI } from "../../../utils/api"

const HonorsSection = forwardRef((props, ref) => {
  const [honors, setHonors] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [validationErrors, setValidationErrors] = useState({})

  // Expose getData method to parent
  useImperativeHandle(ref, () => ({
    getData: () => honors
  }))

  // Validation function
  const validateField = (field, value, honorId) => {
    const errors = { ...validationErrors }
    const key = `${honorId}-${field}`

    switch (field) {
      case 'title':
        if (!value || value.trim() === '') {
          errors[key] = 'Award title is required'
        } else if (value.length < 3) {
          errors[key] = 'Title must be at least 3 characters'
        } else {
          delete errors[key]
        }
        break
      case 'institution':
        if (value && value.length < 2) {
          errors[key] = 'Institution must be at least 2 characters'
        } else {
          delete errors[key]
        }
        break
      case 'description':
        if (value && value.length > 200) {
          errors[key] = 'Description must be 200 characters or less'
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

  // Load honors from mentor profile achievements
  useEffect(() => {
    loadHonors()
  }, [])

  const loadHonors = async () => {
    try {
      const response = await mentorProfileAPI.get()
      if (response.data?.success && response.data.data.profile?.achievements) {
        // Convert achievements (strings) to honor objects with structure
        const honorsData = response.data.data.profile.achievements.map((achievement, index) => {
          // Try to parse if it's JSON, otherwise use simple format
          try {
            const parsed = JSON.parse(achievement)
            return { id: index + 1, ...parsed }
          } catch {
            return {
              id: index + 1,
              title: achievement,
              institution: "",
              date: "",
              description: ""
            }
          }
        })
        setHonors(honorsData)
      }
    } catch (error) {
      console.error('Error loading honors:', error)
      setHonors([])
    }
  }

  const saveHonorsToBackend = async (updatedHonors) => {
    try {
      // Convert honors to JSON strings for backend achievements array
      const achievements = updatedHonors.map(honor => JSON.stringify({
        title: honor.title,
        institution: honor.institution,
        date: honor.date,
        description: honor.description
      }))
      await mentorProfileAPI.update({ achievements })
    } catch (error) {
      console.error('Error saving honors:', error)
      setMessage("✗ Failed to save")
      setTimeout(() => setMessage(""), 3000)
    }
  }

  const updateHonor = (id, field, value) => {
    // Validate field
    validateField(field, value, id)

    const updatedHonors = honors.map(honor =>
      honor.id === id ? { ...honor, [field]: value } : honor
    )
    setHonors(updatedHonors)

    // Debounce save
    clearTimeout(window.honorUpdateTimeout)
    window.honorUpdateTimeout = setTimeout(() => {
      saveHonorsToBackend(updatedHonors)
    }, 1000)
  }

  const addHonor = async () => {
    const newHonor = {
      id: Date.now(),
      title: "",
      institution: "",
      date: "",
      description: "",
    }
    const updatedHonors = [...honors, newHonor]
    setHonors(updatedHonors)
    await saveHonorsToBackend(updatedHonors)
  }

  const removeHonor = async (id) => {
    const updatedHonors = honors.filter((honor) => honor.id !== id)
    setHonors(updatedHonors)
    await saveHonorsToBackend(updatedHonors)
  }

  return (
    <div className="bg-[#1a1a1a] rounded-2xl p-4 sm:p-6 border border-[#2a2a2a]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#5D38DE]/20 rounded-lg flex items-center justify-center">
            <Award className="w-4 h-4 sm:w-5 sm:h-5 text-[#5D38DE]" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">Honors & Awards</h2>
        </div>
        <button
          onClick={addHonor}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-[#5D38DE] text-white rounded-lg hover:bg-[#4d2ec4] transition-colors text-sm sm:text-base w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4" />
          Add Award
        </button>
      </div>

      {message && (
        <p className={`text-sm mb-4 ${message.startsWith("✓") ? "text-green-500" : "text-red-500"}`}>
          {message}
        </p>
      )}

      <div className="space-y-4">
        {honors.map((honor) => (
          <div key={honor.id} className="bg-[#242424] rounded-xl p-4 sm:p-5 border border-[#3a3a3a] relative group">
            <button
              onClick={() => removeHonor(honor.id)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 sm:p-2 bg-red-500/20 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/30 z-10"
            >
              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pr-12 sm:pr-14">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Award Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={honor.title}
                  onChange={(e) => updateHonor(honor.id, 'title', e.target.value)}
                  className={`w-full bg-[#1a1a1a] text-white rounded-lg p-3 border focus:outline-none text-sm sm:text-base transition-colors ${validationErrors[`${honor.id}-title`]
                    ? 'border-red-500 focus:border-red-500'
                    : honor.title && honor.title.length >= 3
                      ? 'border-green-500 focus:border-green-500'
                      : 'border-[#3a3a3a] focus:border-[#5D38DE]'
                    }`}
                  placeholder="e.g., Best Developer Award"
                />
                {validationErrors[`${honor.id}-title`] ? (
                  <p className="text-red-400 text-xs mt-1">{validationErrors[`${honor.id}-title`]}</p>
                ) : (
                  <p className="text-gray-500 text-xs mt-1">Required: Name of the award or honor</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Institution</label>
                <input
                  type="text"
                  value={honor.institution}
                  onChange={(e) => updateHonor(honor.id, 'institution', e.target.value)}
                  className={`w-full bg-[#1a1a1a] text-white rounded-lg p-3 border focus:outline-none text-sm sm:text-base transition-colors ${validationErrors[`${honor.id}-institution`]
                    ? 'border-red-500 focus:border-red-500'
                    : honor.institution && honor.institution.length >= 2
                      ? 'border-green-500 focus:border-green-500'
                      : 'border-[#3a3a3a] focus:border-[#5D38DE]'
                    }`}
                  placeholder="Organization name"
                />
                {validationErrors[`${honor.id}-institution`] ? (
                  <p className="text-red-400 text-xs mt-1">{validationErrors[`${honor.id}-institution`]}</p>
                ) : (
                  <p className="text-gray-500 text-xs mt-1">Optional: Awarding organization</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Date</label>
                <input
                  type="text"
                  value={honor.date}
                  onChange={(e) => updateHonor(honor.id, 'date', e.target.value)}
                  className="w-full bg-[#1a1a1a] text-white rounded-lg p-3 border border-[#3a3a3a] focus:border-[#5D38DE] focus:outline-none text-sm sm:text-base"
                  placeholder="YYYY"
                />
                <p className="text-gray-500 text-xs mt-1">Optional: Year received</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                <textarea
                  value={honor.description}
                  onChange={(e) => updateHonor(honor.id, 'description', e.target.value)}
                  className={`w-full bg-[#1a1a1a] text-white rounded-lg p-3 border focus:outline-none min-h-[80px] resize-none transition-colors ${validationErrors[`${honor.id}-description`]
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-[#3a3a3a] focus:border-[#5D38DE]'
                    }`}
                  placeholder="What was this award for?"
                />
                {validationErrors[`${honor.id}-description`] ? (
                  <p className="text-red-400 text-xs mt-1">{validationErrors[`${honor.id}-description`]}</p>
                ) : (
                  <p className="text-gray-500 text-xs mt-1">Optional: Max 200 characters ({honor.description?.length || 0}/200)</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
})

HonorsSection.displayName = 'HonorsSection'

export default HonorsSection
