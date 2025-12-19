"use client"

import { useState, useEffect } from "react"
import { Plus, Trash2, GraduationCap } from "lucide-react"
import { mentorProfileAPI } from "../../../utils/api"

const EducationSection = () => {
  const [educations, setEducations] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

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

  const addEducation = async () => {
    try {
      setLoading(true)
      const newEdu = {
        degree: "Bachelor's Degree",
        institution: "",
        year: new Date().getFullYear(),
        field: "",
        gpa: 0
      }
      const response = await mentorProfileAPI.addEducation(newEdu)
      if (response.data?.success) {
        await loadEducationData() // Reload to get the ID
        setMessage("✓ Education added")
        setTimeout(() => setMessage(""), 3000)
      }
    } catch (error) {
      setMessage("✗ Failed to add")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const updateEducation = async (id, field, value) => {
    // Update local state immediately for better UX
    setEducations(educations.map(edu =>
      edu._id === id ? { ...edu, [field]: value } : edu
    ))

    // Debounce the API call
    clearTimeout(window.eduUpdateTimeout)
    window.eduUpdateTimeout = setTimeout(async () => {
      try {
        const eduToUpdate = educations.find(e => e._id === id)
        if (eduToUpdate) {
          await mentorProfileAPI.updateEducation(id, {
            ...eduToUpdate,
            [field]: value
          })
        }
      } catch (error) {
        console.error('Update error:', error)
      }
    }, 1000)
  }

  const removeEducation = async (id) => {
    try {
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
                  <label className="block text-sm font-medium text-gray-400 mb-2">Degree</label>
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => updateEducation(edu._id, 'degree', e.target.value)}
                    className="w-full bg-[#1a1a1a] text-white rounded-lg p-3 border border-[#3a3a3a] focus:border-[#5D38DE] focus:outline-none text-sm sm:text-base"
                    placeholder="e.g., Bachelor's in Computer Science"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Institution</label>
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) => updateEducation(edu._id, 'institution', e.target.value)}
                    className="w-full bg-[#1a1a1a] text-white rounded-lg p-3 border border-[#3a3a3a] focus:border-[#5D38DE] focus:outline-none text-sm sm:text-base"
                    placeholder="University name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Field of Study</label>
                  <input
                    type="text"
                    value={edu.field}
                    onChange={(e) => updateEducation(edu._id, 'field', e.target.value)}
                    className="w-full bg-[#1a1a1a] text-white rounded-lg p-3 border border-[#3a3a3a] focus:border-[#5D38DE] focus:outline-none text-sm sm:text-base"
                    placeholder="e.g., Computer Science"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Year</label>
                  <input
                    type="number"
                    value={edu.year}
                    onChange={(e) => updateEducation(edu._id, 'year', parseInt(e.target.value))}
                    className="w-full bg-[#1a1a1a] text-white rounded-lg p-3 border border-[#3a3a3a] focus:border-[#5D38DE] focus:outline-none text-sm sm:text-base"
                    placeholder="2024"
                  />
                </div>
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-2">GPA (Optional)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={edu.gpa}
                    onChange={(e) => updateEducation(edu._id, 'gpa', parseFloat(e.target.value))}
                    className="w-full bg-[#1a1a1a] text-white rounded-lg p-3 border border-[#3a3a3a] focus:border-[#5D38DE] focus:outline-none text-sm sm:text-base"
                    placeholder="e.g., 3.8"
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default EducationSection
