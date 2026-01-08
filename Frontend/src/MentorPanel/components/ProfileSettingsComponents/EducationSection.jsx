"use client"

import { useState, useEffect, forwardRef, useImperativeHandle } from "react"
import { Plus, Trash2, GraduationCap } from "lucide-react"
import { mentorProfileAPI } from "../../../utils/api"

const EducationSection = forwardRef((props, ref) => {
  const [educations, setEducations] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [validationErrors, setValidationErrors] = useState({})

  // Expose getData method to parent
  useImperativeHandle(ref, () => ({
    getData: () => educations
  }))

  // Validation function
  const validateField = (field, value, eduId) => {
    const errors = { ...validationErrors }
    const key = `${eduId}-${field}`

    switch (field) {
      case 'degree':
        if (!value || value.trim() === '') {
          errors[key] = 'Degree is required'
        } else if (value.length < 3) {
          errors[key] = 'Degree must be at least 3 characters'
        } else {
          delete errors[key]
        }
        break
      case 'institution':
        if (!value || value.trim() === '') {
          errors[key] = 'Institution is required'
        } else if (value.length < 3) {
          errors[key] = 'Institution must be at least 3 characters'
        } else {
          delete errors[key]
        }
        break
      case 'year':
        const currentYear = new Date().getFullYear()
        const yearNum = parseInt(value)
        if (!value) {
          errors[key] = 'Year is required'
        } else if (isNaN(yearNum) || yearNum < 1900) {
          errors[key] = 'Year must be 1900 or later'
        } else if (yearNum > currentYear + 10) {
          errors[key] = `Year cannot be more than ${currentYear + 10}`
        } else {
          delete errors[key]
        }
        break
      case 'gpa':
        if (value && value !== '') {
          const gpaNum = parseFloat(value)
          if (isNaN(gpaNum) || gpaNum < 0 || gpaNum > 4.0) {
            errors[key] = 'GPA must be between 0.0 and 4.0'
          } else {
            delete errors[key]
          }
        } else {
          delete errors[key] // GPA is optional
        }
        break
      default:
        delete errors[key]
    }

    setValidationErrors(errors)
    return !errors[key]
  }

  useEffect(() => {
    loadEducationData()
  }, [])

  const loadEducationData = async () => {
    try {
      const response = await mentorProfileAPI.get()
      if (response.data?.success && response.data.data.profile?.education) {
        const eduData = response.data.data.profile.education.map((edu) => ({
          _id: edu._id,
          degree: edu.degree || '',
          institution: edu.institution || '',
          year: edu.year || new Date().getFullYear(),
          field: edu.field || '',
          gpa: edu.gpa || ''
        }))
        setEducations(eduData)
      }
    } catch (error) {
      console.error('Error loading education:', error)
    }
  }

  const addEducation = () => {
    // Add to local state immediately to show input fields
    const newEdu = {
      _id: `temp-${Date.now()}`, // Temporary ID until saved
      degree: "",
      institution: "",
      year: new Date().getFullYear(),
      field: "",
      gpa: ""
    }
    setEducations([...educations, newEdu])
  }

  const updateEducation = async (id, field, value) => {
    // Validate field
    validateField(field, value, id)

    // Update local state immediately for better UX
    const updatedEducations = educations.map(edu =>
      edu._id === id ? { ...edu, [field]: value } : edu
    )
    setEducations(updatedEducations)

    // Debounce the API call
    clearTimeout(window.eduUpdateTimeout)
    window.eduUpdateTimeout = setTimeout(async () => {
      try {
        const eduToUpdate = updatedEducations.find(e => e._id === id)
        if (eduToUpdate) {
          // Check if this is a new education (temporary ID)
          if (id.toString().startsWith('temp-')) {
            // Need to create it first via addEducation API
            const { _id, ...eduData } = eduToUpdate // Remove temp ID
            const response = await mentorProfileAPI.addEducation(eduData)
            if (response.data?.success) {
              // Replace temp ID with real ID from backend
              await loadEducationData()
              setMessage("✓ Education saved")
              setTimeout(() => setMessage(""), 3000)
            }
          } else {
            // Update existing education
            await mentorProfileAPI.updateEducation(id, eduToUpdate)
          }
        }
      } catch (error) {
        console.error('Update error:', error)
        setMessage("✗ Failed to save")
        setTimeout(() => setMessage(""), 3000)
      }
    }, 1000)
  }

  const removeEducation = async (id) => {
    try {
      // If it's a temporary ID, just remove from local state
      if (id.toString().startsWith('temp-')) {
        setEducations(educations.filter(edu => edu._id !== id))
        return
      }

      // Otherwise, delete from backend
      setLoading(true)
      await mentorProfileAPI.deleteEducation(id)
      setEducations(educations.filter(edu => edu._id !== id))
      setMessage("✓ Education removed")
      setTimeout(() => setMessage(""), 3000)
    } catch (error) {
      setMessage("✗ Failed to remove")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#1a1a1a] rounded-2xl p-4 sm:p-6 border border-[#2a2a2a]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#5D38DE]/20 rounded-lg flex items-center justify-center">
            <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-[#5D38DE]" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">Education</h2>
        </div>
        <button
          onClick={addEducation}
          disabled={loading}
          className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-white transition-colors text-sm sm:text-base ${loading ? "bg-gray-600 cursor-not-allowed" : "bg-[#5D38DE] hover:bg-[#4d2ec4]"
            }`}
        >
          <Plus className="w-4 h-4" />
          {loading ? "Adding..." : "Add Education"}
        </button>
      </div>

      {message && (
        <p className={`text-sm mb-4 ${message.startsWith("✓") ? "text-green-500" : "text-red-500"}`}>
          {message}
        </p>
      )}

      <div className="space-y-4">
        {educations.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No education entries yet. Click "Add Education" to get started.</p>
        ) : (
          educations.map((edu) => (
            <div key={edu._id} className="bg-[#242424] rounded-xl p-4 sm:p-5 border border-[#3a3a3a] relative group">
              <button
                onClick={() => removeEducation(edu._id)}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 sm:p-2 bg-red-500/20 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/30"
              >
                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pr-12 sm:pr-14">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Degree <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => updateEducation(edu._id, 'degree', e.target.value)}
                    className={`w-full bg-[#1a1a1a] text-white rounded-lg p-3 border focus:outline-none text-sm sm:text-base transition-colors ${validationErrors[`${edu._id}-degree`]
                      ? 'border-red-500 focus:border-red-500'
                      : edu.degree && edu.degree.length >= 3
                        ? 'border-green-500 focus:border-green-500'
                        : 'border-[#3a3a3a] focus:border-[#5D38DE]'
                      }`}
                    placeholder="e.g., Bachelor's in Computer Science"
                  />
                  {validationErrors[`${edu._id}-degree`] ? (
                    <p className="text-red-400 text-xs mt-1">{validationErrors[`${edu._id}-degree`]}</p>
                  ) : (
                    <p className="text-gray-500 text-xs mt-1">Required: Your degree or qualification</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Institution <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) => updateEducation(edu._id, 'institution', e.target.value)}
                    className={`w-full bg-[#1a1a1a] text-white rounded-lg p-3 border focus:outline-none text-sm sm:text-base transition-colors ${validationErrors[`${edu._id}-institution`]
                      ? 'border-red-500 focus:border-red-500'
                      : edu.institution && edu.institution.length >= 3
                        ? 'border-green-500 focus:border-green-500'
                        : 'border-[#3a3a3a] focus:border-[#5D38DE]'
                      }`}
                    placeholder="University name"
                  />
                  {validationErrors[`${edu._id}-institution`] ? (
                    <p className="text-red-400 text-xs mt-1">{validationErrors[`${edu._id}-institution`]}</p>
                  ) : (
                    <p className="text-gray-500 text-xs mt-1">Required: Name of the institution</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Field of Study
                  </label>
                  <input
                    type="text"
                    value={edu.field}
                    onChange={(e) => updateEducation(edu._id, 'field', e.target.value)}
                    className="w-full bg-[#1a1a1a] text-white rounded-lg p-3 border border-[#3a3a3a] focus:border-[#5D38DE] focus:outline-none text-sm sm:text-base"
                    placeholder="e.g., Computer Science"
                  />
                  <p className="text-gray-500 text-xs mt-1">Optional: Your major or specialization</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Year <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={edu.year}
                    onChange={(e) => updateEducation(edu._id, 'year', parseInt(e.target.value))}
                    className={`w-full bg-[#1a1a1a] text-white rounded-lg p-3 border focus:outline-none text-sm sm:text-base transition-colors ${validationErrors[`${edu._id}-year`]
                      ? 'border-red-500 focus:border-red-500'
                      : edu.year && edu.year >= 1900 && edu.year <= new Date().getFullYear() + 10
                        ? 'border-green-500 focus:border-green-500'
                        : 'border-[#3a3a3a] focus:border-[#5D38DE]'
                      }`}
                    placeholder="2024"
                  />
                  {validationErrors[`${edu._id}-year`] ? (
                    <p className="text-red-400 text-xs mt-1">{validationErrors[`${edu._id}-year`]}</p>
                  ) : (
                    <p className="text-gray-500 text-xs mt-1">Required: Graduation year (1900-{new Date().getFullYear() + 10})</p>
                  )}
                </div>
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-2">GPA (Optional)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={edu.gpa}
                    onChange={(e) => updateEducation(edu._id, 'gpa', parseFloat(e.target.value))}
                    className={`w-full bg-[#1a1a1a] text-white rounded-lg p-3 border focus:outline-none text-sm sm:text-base transition-colors ${validationErrors[`${edu._id}-gpa`]
                      ? 'border-red-500 focus:border-red-500'
                      : edu.gpa && parseFloat(edu.gpa) >= 0 && parseFloat(edu.gpa) <= 4.0
                        ? 'border-green-500 focus:border-green-500'
                        : 'border-[#3a3a3a] focus:border-[#5D38DE]'
                      }`}
                    placeholder="e.g., 3.8"
                  />
                  {validationErrors[`${edu._id}-gpa`] ? (
                    <p className="text-red-400 text-xs mt-1">{validationErrors[`${edu._id}-gpa`]}</p>
                  ) : (
                    <p className="text-gray-500 text-xs mt-1">Optional: Grade Point Average on 4.0 scale (0.0 - 4.0)</p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
})

EducationSection.displayName = 'EducationSection'

export default EducationSection
