import { useState, useEffect } from "react"
import { X, Calendar, Clock, User, MapPin, MessageSquare, Video } from "lucide-react"
import { mentorMenteesAPI } from "../../../utils/api"

const MeetingSchedulingModal = ({ isOpen, onClose, onSchedule }) => {
  const [formData, setFormData] = useState({
    menteeId: "",
    topic: "",
    date: "",
    time: "",
    duration: "60",
    location: "Google Meet",
    description: "",
    meetingType: "video"
  })

  const [errors, setErrors] = useState({})
  const [mentees, setMentees] = useState([])
  const [loadingMentees, setLoadingMentees] = useState(false)

  // Fetch mentees when modal opens
  useEffect(() => {
    if (isOpen) {
      loadMentees()
    }
  }, [isOpen])

  const loadMentees = async () => {
    try {
      setLoadingMentees(true)
      const response = await mentorMenteesAPI.getMentorMentees()
      if (response.data && response.data.success) {
        setMentees(response.data.data.mentees || [])
      }
    } catch (error) {
      console.error('Error loading mentees:', error)
    } finally {
      setLoadingMentees(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.menteeId) {
      newErrors.menteeId = "Mentee selection is required"
    }
    
    if (!formData.topic.trim()) {
      newErrors.topic = "Topic is required"
    }
    
    if (!formData.date) {
      newErrors.date = "Date is required"
    }
    
    if (!formData.time) {
      newErrors.time = "Time is required"
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
      menteeId: "",
      topic: "",
      date: "",
      time: "",
      duration: "60",
      location: "Google Meet",
      description: "",
      meetingType: "video"
    })
    setErrors({})
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1a1a] rounded-2xl p-8 border border-[#2a2a2a] max-w-2xl w-full max-h-[140vh] overflow-y-auto relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 bg-[#242424] text-gray-400 rounded-lg hover:bg-[#2a2a2a] hover:text-white transition-colors border border-[#3a3a3a]"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="pr-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-[#5D38DE] rounded-xl flex items-center justify-center">
              <Video className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Schedule Meeting</h2>
              <p className="text-gray-400">Create a Google Meet session with your mentee</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Mentee Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              <User className="w-4 h-4 inline mr-2" />
              Select Mentee *
            </label>
            <select
              value={formData.menteeId}
              onChange={(e) => handleInputChange('menteeId', e.target.value)}
              className={`w-full bg-[#242424] text-white rounded-lg p-3 border focus:outline-none ${
                errors.menteeId ? 'border-red-500' : 'border-[#3a3a3a] focus:border-[#5D38DE]'
              }`}
              disabled={loadingMentees}
            >
              <option value="">{loadingMentees ? 'Loading mentees...' : 'Select a mentee'}</option>
              {mentees.map((mentee) => {
                const firstName = mentee.profile?.firstName || mentee.firstName || '';
                const lastName = mentee.profile?.lastName || mentee.lastName || '';
                const fullName = `${firstName} ${lastName}`.trim() || 'No Name';
                const email = mentee.email || 'No Email';
                
                return (
                  <option key={mentee._id} value={mentee._id}>
                    {fullName} ({email})
                  </option>
                );
              })}
            </select>
            {errors.menteeId && (
              <p className="text-red-500 text-sm mt-1">{errors.menteeId}</p>
            )}
            {!loadingMentees && mentees.length === 0 && (
              <p className="text-yellow-500 text-sm mt-1">No mentees found in the system.</p>
            )}
          </div>

          {/* Topic */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              <MessageSquare className="w-4 h-4 inline mr-2" />
              Meeting Topic *
            </label>
            <input
              type="text"
              value={formData.topic}
              onChange={(e) => handleInputChange('topic', e.target.value)}
              className={`w-full bg-[#242424] text-white rounded-lg p-3 border focus:outline-none ${
                errors.topic ? 'border-red-500' : 'border-[#3a3a3a] focus:border-[#5D38DE]'
              }`}
              placeholder="e.g., Career Guidance, Technical Interview Prep"
            />
            {errors.topic && (
              <p className="text-red-500 text-sm mt-1">{errors.topic}</p>
            )}
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Date *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className={`w-full bg-[#242424] text-white rounded-lg p-3 border focus:outline-none ${
                  errors.date ? 'border-red-500' : 'border-[#3a3a3a] focus:border-[#5D38DE]'
                }`}
                min={new Date().toISOString().split('T')[0]}
              />
              {errors.date && (
                <p className="text-red-500 text-sm mt-1">{errors.date}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                <Clock className="w-4 h-4 inline mr-2" />
                Time *
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => handleInputChange('time', e.target.value)}
                className={`w-full bg-[#242424] text-white rounded-lg p-3 border focus:outline-none ${
                  errors.time ? 'border-red-500' : 'border-[#3a3a3a] focus:border-[#5D38DE]'
                }`}
              />
              {errors.time && (
                <p className="text-red-500 text-sm mt-1">{errors.time}</p>
              )}
            </div>
          </div>

          {/* Duration and Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                <Clock className="w-4 h-4 inline mr-2" />
                Duration (minutes)
              </label>
              <select
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
                className="w-full bg-[#242424] text-white rounded-lg p-3 border border-[#3a3a3a] focus:border-[#5D38DE] focus:outline-none"
              >
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="90">1.5 hours</option>
                <option value="120">2 hours</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                <MapPin className="w-4 h-4 inline mr-2" />
                Location
              </label>
              <select
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full bg-[#242424] text-white rounded-lg p-3 border border-[#3a3a3a] focus:border-[#5D38DE] focus:outline-none"
              >
                <option value="Google Meet">Google Meet</option>
                <option value="Zoom">Zoom</option>
                <option value="Microsoft Teams">Microsoft Teams</option>
                <option value="In-person">In-person</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              <MessageSquare className="w-4 h-4 inline mr-2" />
              Additional Notes
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full bg-[#242424] text-white rounded-lg p-3 border border-[#3a3a3a] focus:border-[#5D38DE] focus:outline-none min-h-[100px] resize-none"
              placeholder="Any additional information about the meeting..."
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-6 py-3 bg-[#242424] text-white rounded-lg hover:bg-[#2a2a2a] transition-colors border border-[#3a3a3a]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-[#5D38DE] text-white rounded-lg hover:bg-[#4d2ec4] transition-colors"
            >
              Create Google Meet
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default MeetingSchedulingModal
