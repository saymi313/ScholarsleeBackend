import { Calendar, Clock, User, MapPin, MessageSquare, Video, CheckCircle } from "lucide-react"

const MeetingConfirmationModal = ({ isOpen, meetingDetails, onConfirm, onCancel }) => {
  if (!isOpen) return null

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified"
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (timeString) => {
    if (!timeString) return "Not specified"
    const [hours, minutes] = timeString.split(':')
    const date = new Date()
    date.setHours(parseInt(hours), parseInt(minutes))
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1a1a] rounded-2xl p-8 border border-[#2a2a2a] max-w-2xl w-full relative">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-green-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Confirm Meeting Details</h2>
            <p className="text-gray-400">Please review the meeting information before generating the link</p>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          {/* Meeting Overview */}
          <div className="bg-[#242424] rounded-lg p-4 border border-[#3a3a3a]">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <Video className="w-5 h-5 text-[#5D38DE]" />
              Meeting Overview
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-gray-400" />
                <div>
                  <span className="text-gray-400 text-sm">Mentee:</span>
                  <span className="text-white ml-2 font-medium">{meetingDetails.menteeName}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4 text-gray-400" />
                <div>
                  <span className="text-gray-400 text-sm">Topic:</span>
                  <span className="text-white ml-2 font-medium">{meetingDetails.topic}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-gray-400" />
                <div>
                  <span className="text-gray-400 text-sm">Date:</span>
                  <span className="text-white ml-2 font-medium">{formatDate(meetingDetails.date)}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-gray-400" />
                <div>
                  <span className="text-gray-400 text-sm">Time:</span>
                  <span className="text-white ml-2 font-medium">{formatTime(meetingDetails.time)}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-gray-400" />
                <div>
                  <span className="text-gray-400 text-sm">Duration:</span>
                  <span className="text-white ml-2 font-medium">{meetingDetails.duration} minutes</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-gray-400" />
                <div>
                  <span className="text-gray-400 text-sm">Location:</span>
                  <span className="text-white ml-2 font-medium">{meetingDetails.location}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          {meetingDetails.description && (
            <div className="bg-[#242424] rounded-lg p-4 border border-[#3a3a3a]">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#5D38DE]" />
                Additional Notes
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">{meetingDetails.description}</p>
            </div>
          )}

          {/* What will happen */}
          <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20">
            <h3 className="text-lg font-semibold text-blue-400 mb-3">What will happen next:</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                <span>Generate a demo meeting link for testing</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                <span>Prepare meeting details and information</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                <span>Display the demo link for demonstration</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                <span>This is a demo version - no real meeting created</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-3 bg-[#242424] text-white rounded-lg hover:bg-[#2a2a2a] transition-colors border border-[#3a3a3a]"
          >
            Back to Edit
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-6 py-3 bg-[#5D38DE] text-white rounded-lg hover:bg-[#4d2ec4] transition-colors"
          >
            Generate Demo Link
          </button>
        </div>
      </div>
    </div>
  )
}

export default MeetingConfirmationModal
