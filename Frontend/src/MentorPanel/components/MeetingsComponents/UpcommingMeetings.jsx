import React, { useState } from 'react'

const UpcomingMeetings = () => {
    const meetings = [
      {
        id: 1,
        name: "Soban Ahsan",
        service: "High Erasmus Mundus Scholarship Prep",
        time: "18:30 PM to 19:30 PM",
        date: "Tomorrow, 12:00 PM",
        avatar:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/abstract-profile-y1cvdWbhSPrGNX7LKZoIaQKKM355F3.png",
        gradient: "from-purple-600 to-purple-800",
      },
      {
        id: 2,
        name: "Soban Ahsan",
        service: "High Erasmus Mundus Scholarship Prep",
        time: "18:30 PM to 19:30 PM",
        date: "Tomorrow, 12:00 PM",
        avatar:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/abstract-profile-y1cvdWbhSPrGNX7LKZoIaQKKM355F3.png",
        gradient: "from-purple-500 to-purple-700",
      },
      {
        id: 3,
        name: "Soban Ahsan",
        service: "High Erasmus Mundus Scholarship Prep",
        time: "18:30 PM to 19:30 PM",
        date: "Tomorrow, 12:00 PM",
        avatar:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/abstract-profile-y1cvdWbhSPrGNX7LKZoIaQKKM355F3.png",
        gradient: "from-purple-600 to-purple-900",
      },
    ]

    const [currentIndex, setCurrentIndex] = useState(0)
  
    const nextSlide = () => {
      setCurrentIndex((prev) => (prev + 1) % meetings.length)
    }

    const prevSlide = () => {
      setCurrentIndex((prev) => (prev - 1 + meetings.length) % meetings.length)
    }
  
    return (
      <div className="bg-[#242424] rounded-xl p-4 sm:p-6">
        <h3 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Upcomming meetings today</h3>
  
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
                  className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-white' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }
  
  export default UpcomingMeetings
  