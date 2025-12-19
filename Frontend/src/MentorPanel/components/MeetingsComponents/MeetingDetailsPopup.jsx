import { useState, useEffect } from "react"
import { X, Calendar, Clock, User, Video, ExternalLink, MessageSquare, Trash2, AlertTriangle } from "lucide-react"
import meetingService from "../../pages/Meetings/meetingService"

const MeetingDetailsPopup = ({ isOpen, onClose, selectedDate, meetings: meetingsProp, onMeetingDeleted }) => {
  const [meetings, setMeetings] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [meetingToDelete, setMeetingToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (isOpen && selectedDate) {
      // Use meetings from prop if provided, otherwise fetch
      if (meetingsProp && meetingsProp.length > 0) {
        setMeetings(meetingsProp)
        setLoading(false)
        setError("")
      } else {
        loadMeetingsForDate()
      }
    } else {
      setMeetings([])
      setError("")
    }
  }, [isOpen, selectedDate, meetingsProp])

  const loadMeetingsForDate = async () => {
    try {
      setLoading(true)
      setError("")
      const result = await meetingService.getMeetingsByDate(selectedDate)
      if (result.success) {
        setMeetings(result.meetings || [])
      } else {
        setError("Failed to load meetings")
      }
    } catch (error) {
      console.error("Error loading meetings:", error)
      setError("Failed to load meetings")
      setMeetings([])
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    })
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "in-progress":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "completed":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
      case "cancelled":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const handleJoinMeeting = (meetingLink) => {
    window.open(meetingLink, "_blank", "noopener,noreferrer")
  }

  const handleDeleteClick = (meeting) => {
    setMeetingToDelete(meeting)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = async () => {
    if (!meetingToDelete) return

    setDeleting(true)
    setError("")
    try {
      const result = await meetingService.deleteMeeting(meetingToDelete._id)
      
      if (result.success) {
        // Remove meeting from local state
        const updatedMeetings = meetings.filter(m => m._id !== meetingToDelete._id)
        setMeetings(updatedMeetings)
        
        // Notify parent to refresh calendar
        if (onMeetingDeleted) {
          onMeetingDeleted()
        }
        
        // Close delete modal
        setShowDeleteModal(false)
        setMeetingToDelete(null)
        
        // If no meetings left, close the popup
        if (updatedMeetings.length === 0) {
          setTimeout(() => {
            onClose()
          }, 500) // Small delay to show the update
        }
      } else {
        setError("Failed to delete meeting. Please try again.")
      }
    } catch (error) {
      console.error("Error deleting meeting:", error)
      setError(error.message || "Failed to delete meeting. Please try again.")
    } finally {
      setDeleting(false)
    }
  }

  const handleCancelDelete = () => {
    setShowDeleteModal(false)
    setMeetingToDelete(null)
    setError("")
  }

  // Clear error when modal closes
  useEffect(() => {
    if (!showDeleteModal) {
      setError("")
    }
  }, [showDeleteModal])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#2a2a2a] max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-[#242424] text-gray-400 rounded-lg hover:bg-[#2a2a2a] hover:text-white transition-colors border border-[#3a3a3a]"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="pr-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-[#5D38DE] rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Meeting Details</h2>
              <p className="text-gray-400">
                {selectedDate && formatDate(selectedDate)}
              </p>
            </div>
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5D38DE]"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {!loading && !error && meetings.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No meetings scheduled for this date</p>
          </div>
        )}

        {!loading && !error && meetings.length > 0 && (
          <div className="space-y-4">
            {meetings.map((meeting) => (
              <div
                key={meeting._id}
                className="bg-[#242424] border border-[#3a3a3a] rounded-lg p-4 hover:border-[#5D38DE]/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {meeting.title}
                    </h3>
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-medium border ${getStatusColor(
                        meeting.status
                      )}`}
                    >
                      {meeting.status === "in-progress"
                        ? "In Progress"
                        : meeting.status.charAt(0).toUpperCase() +
                          meeting.status.slice(1)}
                    </span>
                  </div>
                  {/* Delete button - only show for scheduled meetings (upcoming) */}
                  {meeting.status === 'scheduled' && (
                    <button
                      onClick={() => handleDeleteClick(meeting)}
                      className="ml-3 p-2 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-lg transition-colors"
                      title="Delete meeting"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>
                      {formatTime(meeting.scheduledDate)} • {meeting.duration}{" "}
                      minutes
                    </span>
                  </div>

                  {meeting.menteeId && (
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <User className="w-4 h-4" />
                      <span>
                        {meeting.menteeId.profile?.firstName ||
                          meeting.menteeId.firstName}{" "}
                        {meeting.menteeId.profile?.lastName ||
                          meeting.menteeId.lastName}
                      </span>
                    </div>
                  )}

                  {meeting.description && (
                    <div className="flex items-start gap-2 text-gray-400 text-sm">
                      <MessageSquare className="w-4 h-4 mt-0.5" />
                      <span className="flex-1">{meeting.description}</span>
                    </div>
                  )}
                </div>

                {meeting.meetingLink && (
                  <button
                    onClick={() => handleJoinMeeting(meeting.meetingLink)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#5D38DE] text-white rounded-lg hover:bg-[#4d2ec4] transition-colors font-medium"
                  >
                    <Video className="w-4 h-4" />
                    <span>Join Meeting</span>
                    <ExternalLink className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-[#3a3a3a]">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-[#242424] text-white rounded-lg hover:bg-[#2a2a2a] transition-colors border border-[#3a3a3a]"
          >
            Close
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && meetingToDelete && (
        <div className="fixed inset-0 z-[60] overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 transition-opacity bg-black bg-opacity-75"
              onClick={!deleting ? handleCancelDelete : undefined}
            />

            {/* Modal */}
            <div className="inline-block w-full max-w-md p-0 my-8 overflow-hidden text-left align-middle transition-all transform bg-[#1a1a1a] shadow-xl rounded-2xl border border-[#2a2a2a]">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-[#2a2a2a]">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-600/20 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Delete Meeting</h3>
                    <p className="text-gray-400 text-sm">This action cannot be undone</p>
                  </div>
                </div>
                <button
                  onClick={handleCancelDelete}
                  disabled={deleting}
                  className="p-2 text-gray-400 hover:text-white hover:bg-[#2a2a2a] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="mb-6">
                  <p className="text-gray-300 mb-4">
                    Are you sure you want to delete the meeting <span className="font-semibold text-white">"{meetingToDelete.title}"</span>? 
                    This action cannot be undone and will permanently remove the meeting from your calendar.
                  </p>
                  
                  <div className="bg-[#2a2a2a] rounded-lg p-4 border border-[#3a3a3a]">
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Meeting Details:</h4>
                    <div className="space-y-1 text-sm text-gray-400">
                      <p><span className="text-gray-300">Date:</span> {formatDate(meetingToDelete.scheduledDate)}</p>
                      <p><span className="text-gray-300">Time:</span> {formatTime(meetingToDelete.scheduledDate)}</p>
                      <p><span className="text-gray-300">Duration:</span> {meetingToDelete.duration} minutes</p>
                      {meetingToDelete.menteeId && (
                        <p><span className="text-gray-300">Mentee:</span> {
                          meetingToDelete.menteeId.profile?.firstName || meetingToDelete.menteeId.firstName
                        } {
                          meetingToDelete.menteeId.profile?.lastName || meetingToDelete.menteeId.lastName
                        }</p>
                      )}
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="mb-4 bg-red-600/20 border border-red-600 text-red-400 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={handleCancelDelete}
                    disabled={deleting}
                    className="flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    disabled={deleting}
                    className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {deleting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4" />
                        Delete Meeting
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MeetingDetailsPopup


