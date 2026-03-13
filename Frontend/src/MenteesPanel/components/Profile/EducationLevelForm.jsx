import { useState } from "react"

export default function EducationLevelForm({ value, onChange }) {
  const [errors, setErrors] = useState({})

  const educationLevels = [
    "High School",
    "Associate Degree",
    "Bachelor's Degree",
    "Master's Degree",
    "PhD",
    "Professional Degree",
    "Other"
  ]

  const validateField = (field, val) => {
    const newErrors = { ...errors }

    if (field === 'educationLevel') {
      if (!val || val.trim() === '') {
        newErrors.educationLevel = 'Please select your education level'
      } else {
        delete newErrors.educationLevel
      }
    }

    if (field === 'currentInstitution') {
      if (val && val.length > 100) {
        newErrors.currentInstitution = 'Institution name is too long'
      } else {
        delete newErrors.currentInstitution
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (field, val) => {
    validateField(field, val)
    onChange({ [field]: val })
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Current Education Level<span className="text-red-500">*</span>
        </label>
        <select
          value={value.educationLevel || ""}
          onChange={(e) => handleChange('educationLevel', e.target.value)}
          className={`w-full bg-white border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 ${errors.educationLevel
              ? 'border-red-300 focus:ring-red-500'
              : 'border-gray-300 focus:ring-[#5D38DE]'
            }`}
        >
          <option value="">Select your education level</option>
          {educationLevels.map((level) => (
            <option key={level} value={level}>{level}</option>
          ))}
        </select>
        {errors.educationLevel && (
          <p className="mt-1 text-xs text-red-600">{errors.educationLevel}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Current Institution</label>
        <input
          value={value.currentInstitution || ""}
          onChange={(e) => handleChange('currentInstitution', e.target.value)}
          className={`w-full bg-white border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 ${errors.currentInstitution
              ? 'border-red-300 focus:ring-red-500'
              : 'border-gray-300 focus:ring-[#5D38DE]'
            }`}
          placeholder="e.g., Harvard University, MIT, etc."
        />
        {errors.currentInstitution && (
          <p className="mt-1 text-xs text-red-600">{errors.currentInstitution}</p>
        )}
      </div>
    </div>
  )
}
