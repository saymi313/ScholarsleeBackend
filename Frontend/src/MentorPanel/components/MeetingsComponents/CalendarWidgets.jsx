"use client"

import { useState, useEffect, useRef } from "react"
import meetingService from "../../pages/Meetings/meetingService"

const CalendarWidget = ({ selectedDate, setSelectedDate, onDateClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false)
  const [meetingsByDate, setMeetingsByDate] = useState({})
  const [loading, setLoading] = useState(false)
  const dropdownRef = useRef(null)

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"]
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsMonthDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Fetch meetings when month changes
  useEffect(() => {
    const loadMeetingsForMonth = async () => {
      try {
        setLoading(true)
        const year = currentDate.getFullYear()
        const month = currentDate.getMonth()
        
        // Get start and end of month
        const startDate = new Date(year, month, 1)
        const endDate = new Date(year, month + 1, 0, 23, 59, 59, 999)

        const result = await meetingService.getMeetingsByDateRange(startDate, endDate)
        if (result.success) {
          setMeetingsByDate(result.meetingsByDate || {})
        }
      } catch (error) {
        console.error('Error loading meetings:', error)
        setMeetingsByDate({})
      } finally {
        setLoading(false)
      }
    }
    
    loadMeetingsForMonth()
  }, [currentDate])

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    const days = []
    for (let i = 0; i < firstDay; i++) {
      days.push(null)
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }
    return days
  }

  const days = getDaysInMonth(currentDate)

  const handleMonthChange = (monthIndex) => {
    setCurrentDate(new Date(currentDate.getFullYear(), monthIndex, 1))
    setIsMonthDropdownOpen(false)
  }

  const handleDateClick = (day) => {
    if (!day) return
    
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const date = new Date(year, month, day)
    const dateKey = date.toISOString().split('T')[0]
    
    // Check if there are meetings on this date
    if (meetingsByDate[dateKey] && meetingsByDate[dateKey].length > 0) {
      setSelectedDate(day)
      if (onDateClick) {
        onDateClick(dateKey)
      }
    } else {
      setSelectedDate(day)
    }
  }

  const hasMeetings = (day) => {
    if (!day) return false
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const date = new Date(year, month, day)
    const dateKey = date.toISOString().split('T')[0]
    return meetingsByDate[dateKey] && meetingsByDate[dateKey].length > 0
  }

  const getMeetingCount = (day) => {
    if (!day) return 0
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const date = new Date(year, month, day)
    const dateKey = date.toISOString().split('T')[0]
    return meetingsByDate[dateKey] ? meetingsByDate[dateKey].length : 0
  }

  return (
    <div className="bg-[#242424] rounded-xl p-4 sm:p-6">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h3 className="text-white font-semibold text-sm sm:text-base">Sessions Dates are here!</h3>
        <div className="w-2 h-2 sm:w-3 sm:h-3 bg-purple-500 rounded-full"></div>
      </div>

      <div className="relative mb-3 sm:mb-4" ref={dropdownRef}>
        <button
          onClick={() => setIsMonthDropdownOpen(!isMonthDropdownOpen)}
          className="w-full flex items-center justify-between bg-[#1a1a1a] text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-700 hover:border-[#5D38DE] transition-colors"
        >
          <span className="font-medium text-sm sm:text-base">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>
          <svg 
            className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform ${isMonthDropdownOpen ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isMonthDropdownOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-[#1a1a1a] border border-gray-700 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
            {monthNames.map((month, index) => (
              <button
                key={index}
                onClick={() => handleMonthChange(index)}
                className={`w-full text-left px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm transition-colors first:rounded-t-lg last:rounded-b-lg ${
                  currentDate.getMonth() === index
                    ? "bg-[#5D38DE] text-white"
                    : "text-gray-300 hover:bg-[#2a2a2a] hover:text-white"
                }`}
              >
                {month} {currentDate.getFullYear()}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-1 sm:mb-2">
        {daysOfWeek.map((day) => (
          <div key={day} className="text-center text-gray-500 text-xs font-medium">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {days.map((day, index) => {
          const hasMeetingsOnDay = hasMeetings(day)
          const meetingCount = getMeetingCount(day)
          
          return (
            <div
              key={index}
              onClick={() => handleDateClick(day)}
              className={`
                aspect-square flex flex-col items-center justify-center text-xs sm:text-sm rounded-lg relative
                ${day === null ? "invisible" : ""}
                ${
                  hasMeetingsOnDay
                    ? "bg-gradient-to-br from-purple-500 to-purple-700 text-white font-medium"
                    : selectedDate === day
                    ? "bg-[#5D38DE] text-white font-medium"
                    : "text-gray-400 hover:bg-gray-800"
                }
                transition-colors cursor-pointer
              `}
              title={hasMeetingsOnDay ? `${meetingCount} meeting${meetingCount > 1 ? 's' : ''} on this day` : ''}
            >
              <span>{day}</span>
              {hasMeetingsOnDay && meetingCount > 1 && (
                <span className="absolute top-0 right-0 bg-white/20 rounded-full w-4 h-4 flex items-center justify-center text-[10px] mt-0.5 mr-0.5">
                  {meetingCount}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default CalendarWidget
