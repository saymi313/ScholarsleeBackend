import { useState } from "react"
import { Copy, Check, Calendar, Clock, User, MapPin, MessageSquare, Video, ExternalLink, Share2, Link } from "lucide-react"

const MeetingLinkDisplay = ({ isVisible, meetingDetails, meetingLink, onClose, onScheduleAnother }) => {
  const [copied, setCopied] = useState(false)
  const [showShareOptions, setShowShareOptions] = useState(false)

  if (!isVisible) return null

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(meetingLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = meetingLink
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const openMeetingLink = () => {
    window.open(meetingLink, '_blank')
  }

  const shareMeeting = () => {
    if (navigator.share) {
      navigator.share({
        title: `Meeting: ${meetingDetails.topic}`,
        text: `Join our meeting: ${meetingDetails.topic}`,
        url: meetingLink
      })
    } else {
      setShowShareOptions(true)
    }
  }

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
      <div className="bg-[#1a1a1a] rounded-2xl p-8 border border-[#2a2a2a] max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
            <Check className="w-6 h-6 text-green-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Meeting Created Successfully!</h2>
            <p className="text-gray-400">Your Google Meet session is ready</p>
          </div>
        </div>

        {/* Meeting Details Summary */}
        <div className="bg-[#242424] rounded-lg p-6 border border-[#3a3a3a] mb-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Video className="w-5 h-5 text-[#5D38DE]" />
            Meeting Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>
        </div>

        {/* Meeting Link */}
        <div className="bg-[#242424] rounded-lg p-6 border border-[#3a3a3a] mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Link className="w-5 h-5 text-[#5D38DE]" />
              Meeting Link
            </h3>
            <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-semibold rounded-full">
              Verified
            </span>
          </div>

          <div className="bg-[#1a1a1a] rounded-lg p-4 border border-[#3a3a3a] mb-4">
            <p className="text-white text-sm break-all">{meetingLink}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 px-4 py-2 bg-[#5D38DE] text-white rounded-lg hover:bg-[#4d2ec4] transition-colors"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy Link'}
            </button>

            <button
              onClick={openMeetingLink}
              className="flex items-center gap-2 px-4 py-2 bg-[#242424] text-white rounded-lg hover:bg-[#2a2a2a] transition-colors border border-[#3a3a3a]"
            >
              <ExternalLink className="w-4 h-4" />
              Open Meeting
            </button>

            <button
              onClick={shareMeeting}
              className="flex items-center gap-2 px-4 py-2 bg-[#242424] text-white rounded-lg hover:bg-[#2a2a2a] transition-colors border border-[#3a3a3a]"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </div>

        {/* Success Message */}
        <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/20 mb-6">
          <div className="flex items-start gap-3">
            <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-green-400 font-semibold mb-1"> Meeting Link Generated!</h4>
              <p className="text-gray-300 text-sm">
                Meeting has been scheduled successfully!
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onScheduleAnother}
            className="flex-1 px-6 py-3 bg-[#242424] text-white rounded-lg hover:bg-[#2a2a2a] transition-colors border border-[#3a3a3a]"
          >
            Schedule Another
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-[#5D38DE] text-white rounded-lg hover:bg-[#4d2ec4] transition-colors"
          >
            Done
          </button>
        </div>

        {/* Share Options Modal */}
        {showShareOptions && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-2xl">
            <div className="bg-[#242424] rounded-lg p-6 border border-[#3a3a3a] max-w-sm w-full mx-4">
              <h4 className="text-white font-semibold mb-4">Share Meeting</h4>
              <p className="text-gray-400 text-sm mb-4">
                Copy the meeting link and share it through your preferred method:
              </p>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    copyToClipboard()
                    setShowShareOptions(false)
                  }}
                  className="w-full text-left px-3 py-2 bg-[#1a1a1a] text-white rounded hover:bg-[#2a2a2a] transition-colors"
                >
                  Copy Link
                </button>
                <button
                  onClick={() => {
                    window.open(`mailto:?subject=Meeting: ${meetingDetails.topic}&body=Join our meeting: ${meetingLink}`)
                    setShowShareOptions(false)
                  }}
                  className="w-full text-left px-3 py-2 bg-[#1a1a1a] text-white rounded hover:bg-[#2a2a2a] transition-colors"
                >
                  Email Link
                </button>
                <button
                  onClick={() => {
                    window.open(`https://wa.me/?text=Join our meeting: ${meetingLink}`)
                    setShowShareOptions(false)
                  }}
                  className="w-full text-left px-3 py-2 bg-[#1a1a1a] text-white rounded hover:bg-[#2a2a2a] transition-colors"
                >
                  WhatsApp
                </button>
              </div>
              <button
                onClick={() => setShowShareOptions(false)}
                className="w-full mt-4 px-3 py-2 bg-[#5D38DE] text-white rounded hover:bg-[#4d2ec4] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MeetingLinkDisplay
