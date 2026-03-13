import { useState, useEffect } from "react"
import { X, Calendar, Clock, User, MapPin, MessageSquare, Video } from "lucide-react"

const MenteeMeetingSchedulingModal = ({ isOpen, onClose, onSchedule, booking }) => {
  const [formData, setFormData] = useState({
    topic: "",
    date: "",
    time: "",
    duration: "60",
    location: "Google Meet",
    description: "",
  })

  const [errors, setErrors] = useState({})

  // Pre-fill mentor info from booking when modal opens
  useEffect(() => {
    if (isOpen && booking) {
      setFormData(prev => ({
        ...prev,
        topic: booking.serviceId?.title || "Service Consultation",
      }))
    }
  }, [isOpen, booking])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.topic.trim()) {
      newErrors.topic = "Please enter a meeting topic"
    }

    if (!formData.date) {
      newErrors.date = "Please choose a date"
    }

    if (!formData.time) {
      newErrors.time = "Please choose a time"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (validateForm()) {
      onSchedule(formData)
    }
  }

  const handleClose = () => {
    setFormData({
      topic: "",
      date: "",
      time: "",
      duration: "60",
      location: "Google Meet",
      description: "",
    })
    setErrors({})
    onClose()
  }

  if (!isOpen || !booking) return null

  const mentorName = booking.mentorId
    ? `${booking.mentorId.profile?.firstName || ""} ${booking.mentorId.profile?.lastName || ""}`.trim()
    : "Mentor"

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-3 sm:p-4 md:p-6">
      <div className="bg-[#1a1a1a] rounded-2xl p-5 sm:p-6 md:p-8 border border-[#2a2a2a] w-full max-w-sm sm:max-w-lg md:max-w-2xl max-h-[85vh] sm:max-h-[90vh] overflow-y-auto relative">
        {/* Header */}
        <div className="flex items-start sm:items-center justify-between gap-3 mb-5 sm:mb-6 sticky top-0 bg-[#1a1a1a] pb-3 sm:pb-0">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <Calendar className="w-5 sm:w-6 h-5 sm:h-6 text-[#5D38DE] flex-shrink-0" />
            <div className="min-w-0">
              <h2 className="text-lg sm:text-2xl font-bold text-white truncate">Schedule Meeting</h2>
              <p className="text-xs sm:text-sm text-gray-400 truncate">with {mentorName}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors flex-shrink-0"
          >
            <X className="w-5 sm:w-6 h-5 sm:h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          {/* Mentor Info (Read-only) */}
          <div className="bg-gradient-to-r from-[#5D38DE]/10 to-[#2a2a2a] p-3 sm:p-4 rounded-lg sm:rounded-xl border border-[#2a2a2a]">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <User className="w-4 sm:w-5 h-4 sm:h-5 text-[#5D38DE] flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-gray-300">Meeting With</span>
            </div>
            <p className="text-base sm:text-lg font-semibold text-white ml-6 sm:ml-8">{mentorName}</p>
            {booking.serviceId?.title && (
              <p className="text-xs sm:text-sm text-gray-400 ml-6 sm:ml-8 mt-1">Service: {booking.serviceId.title}</p>
            )}
          </div>

          {/* Topic */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 flex-shrink-0" />
              Meeting Topic
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.topic}
              onChange={(e) => handleInputChange("topic", e.target.value)}
              placeholder="e.g., Career Guidance, Technical Interview Prep"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg text-white placeholder-gray-500 text-sm focus:border-[#5D38DE] focus:outline-none transition-colors"
            />
            {errors.topic && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.topic}</p>}
          </div>

          {/* Date and Time Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {/* Date */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 flex-shrink-0" />
                Date
                <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg text-white text-sm focus:border-[#5D38DE] focus:outline-none transition-colors"
              />
              {errors.date && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.date}</p>}
            </div>

            {/* Time */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4 flex-shrink-0" />
                Time
                <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => handleInputChange("time", e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg text-white text-sm focus:border-[#5D38DE] focus:outline-none transition-colors"
              />
              {errors.time && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.time}</p>}
            </div>
          </div>

          {/* Duration and Location Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {/* Duration */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4 flex-shrink-0" />
                Duration (minutes)
              </label>
              <select
                value={formData.duration}
                onChange={(e) => handleInputChange("duration", e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg text-white text-sm focus:border-[#5D38DE] focus:outline-none transition-colors"
              >
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="90">1.5 hours</option>
                <option value="120">2 hours</option>
                <option value="180">3 hours</option>
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                disabled
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg text-white text-sm opacity-60 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">Google Meet link will be generated</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 flex-shrink-0" />
              Additional Notes (Optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Any additional information about the meeting..."
              rows="3"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg text-white placeholder-gray-500 text-sm focus:border-[#5D38DE] focus:outline-none transition-colors resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 pt-4 sm:pt-6 border-t border-[#2a2a2a]">
            <button
              type="button"
              onClick={handleClose}
              className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-[#2a2a2a] text-gray-300 rounded-lg hover:bg-[#3a3a3a] transition-colors font-medium text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-[#5D38DE] to-[#4d2bc4] text-white rounded-lg hover:from-[#4d2bc4] hover:to-[#3d1fb0] transition-colors font-medium text-sm flex items-center justify-center gap-2"
            >
              <Video className="w-4 h-4" />
              Schedule Meeting
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default MenteeMeetingSchedulingModal
