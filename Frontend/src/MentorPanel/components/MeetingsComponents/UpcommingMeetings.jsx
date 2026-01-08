import React, { useState, useEffect } from 'react'
import meetingService from "../../pages/Meetings/meetingService"

const UpcomingMeetings = ({ refreshTrigger }) => {
  const [meetings, setMeetings] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const fetchUpcomingMeetings = async () => {
      try {
        setLoading(true)
        const today = new Date()
        const nextWeek = new Date(today)
        nextWeek.setDate(today.getDate() + 7)

        const result = await meetingService.getMeetingsByDateRange(today, nextWeek)

        if (result.success && result.meetings) {
          // Filter only future meetings and sort by date
          const upcoming = result.meetings
            .filter(m => new Date(m.scheduledDate) > new Date())
            .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate))
            .map(m => ({
              id: m._id,
              name: m.menteeName || "Mentee", // Assuming backend populates this or we use placeholder
              service: m.title || "Mentorship Session",
              time: new Date(m.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              date: new Date(m.scheduledDate).toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' }),
              avatar: m.menteeAvatar || "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/abstract-profile-y1cvdWbhSPrGNX7LKZoIaQKKM355F3.png",
              gradient: "from-purple-600 to-purple-800" // retain random or static gradient
            }))
          setMeetings(upcoming)
        }
      } catch (error) {
        console.error("Error fetching upcoming meetings:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUpcomingMeetings()
  }, [refreshTrigger])

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % meetings.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + meetings.length) % meetings.length)
  }

  return (
    <div className="bg-[#242424] rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Upcoming meetings (Next 7 Days)</h3>

      {loading ? (
        <div className="text-center py-8 text-gray-400">Loading...</div>
      ) : meetings.length === 0 ? (
        <div className="text-center py-8 text-gray-400">No upcoming meetings scheduled.</div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {/* Navigation buttons - positioned outside content */}
          {meetings.length > 1 && (
            <div className="flex justify-between items-center">
              <button
                onClick={prevSlide}
                className="flex items-center gap-1 sm:gap-2 text-white/70 hover:text-white transition-colors text-xs sm:text-sm"
              >
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="hidden sm:inline">Previous</span>
                <span className="sm:hidden">Prev</span>
              </button>
              <button
                onClick={nextSlide}
                className="flex items-center gap-1 sm:gap-2 text-white/70 hover:text-white transition-colors text-xs sm:text-sm"
              >
                <span className="hidden sm:inline">Next</span>
                <span className="sm:hidden">Next</span>
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}

          {/* Carousel content */}
          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {meetings.map((meeting) => (
                <div key={meeting.id} className="w-full flex-shrink-0 px-1">
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3 sm:p-4 hover:scale-105 transition-all duration-300 cursor-pointer">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                      <img
                        src={meeting.avatar || "/placeholder.svg"}
                        alt={meeting.name}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-white/30"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-medium text-sm sm:text-base truncate">{meeting.name}</h4>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-white/90 text-xs sm:text-sm break-words">{meeting.service}</p>
                      <p className="text-white/70 text-xs">{meeting.time}</p>
                      <p className="text-white/70 text-xs">{meeting.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots indicator */}
          {meetings.length > 1 && (
            <div className="flex justify-center space-x-1 sm:space-x-2">
              {meetings.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-colors ${index === currentIndex ? 'bg-white' : 'bg-white/30'
                    }`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default UpcomingMeetings
