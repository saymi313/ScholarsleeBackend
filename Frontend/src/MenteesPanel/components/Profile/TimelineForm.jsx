import { useState } from "react"

export default function TimelineForm({ value, onChange }) {
  const [errors, setErrors] = useState({})
  
  const timelineOptions = [
    { value: "Immediate", label: "Immediate (within 1 month)" },
    { value: "Short-term", label: "Short-term (1-3 months)" },
    { value: "Medium-term", label: "Medium-term (3-6 months)" },
    { value: "Long-term", label: "Long-term (6-12 months)" },
    { value: "Flexible", label: "Flexible (no specific timeline)" }
  ]

  const validateField = (field, val) => {
    const newErrors = { ...errors }
    
    if (field === 'timeline') {
      if (!val || val.trim() === '') {
        newErrors.timeline = 'Study timeline is required'
      } else {
        delete newErrors.timeline
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (field, val) => {
    validateField(field, val)
    onChange({ ...value, [field]: val })
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Study Timeline<span className="text-red-500">*</span>
        </label>
        <select
          value={value.timeline || ""}
          onChange={(e) => handleChange('timeline', e.target.value)}
          className={`w-full bg-white border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
            errors.timeline 
              ? 'border-red-300 focus:ring-red-500' 
              : 'border-gray-300 focus:ring-[#5D38DE]'
          }`}
        >
          <option value="">Select your preferred timeline</option>
          {timelineOptions.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        {errors.timeline && (
          <p className="mt-1 text-xs text-red-600">{errors.timeline}</p>
        )}
      </div>

      {value.timeline && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            <strong>Selected Timeline:</strong> {timelineOptions.find(t => t.value === value.timeline)?.label}
          </p>
        </div>
      )}
    </div>
  )
}
