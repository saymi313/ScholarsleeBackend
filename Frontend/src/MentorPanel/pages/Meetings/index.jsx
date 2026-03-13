import { useState } from "react"
import { useToast } from "../../../context/ToastContext"
import Sidebar from "../../components/Shared/Sidebar"
import TopBar from "../../components/Shared/TopBar"
import MeetingsHeader from "../../components/MeetingsComponents/MeetingsHeader"
import ScheduleMeetingCard from "../../components/MeetingsComponents/ScheduleMeetingCard"
import SessionsTable from "../../components/MeetingsComponents/SessionsTable"
import CalendarWidget from "../../components/MeetingsComponents/CalendarWidgets"
import UpcomingMeetings from "../../components/MeetingsComponents/UpcommingMeetings"
import MeetingSchedulingModal from "../../components/MeetingsComponents/MeetingSchedulingModal"
import MeetingConfirmationModal from "../../components/MeetingsComponents/MeetingConfirmationModal"
import MeetingLoader from "../../components/MeetingsComponents/MeetingLoader"
import MeetingLinkDisplay from "../../components/MeetingsComponents/MeetingLinkDisplay"
import MeetingDetailsPopup from "../../components/MeetingsComponents/MeetingDetailsPopup"
import meetingService from "./meetingService"

const Meetings = () => {
  const { showError } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDate, setSelectedDate] = useState(null)

  // Meeting scheduling states
  const [showSchedulingModal, setShowSchedulingModal] = useState(false)
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const [showLoader, setShowLoader] = useState(false)
  const [showLinkDisplay, setShowLinkDisplay] = useState(false)
  const [meetingDetails, setMeetingDetails] = useState(null)
  const [generatedMeetingLink, setGeneratedMeetingLink] = useState("")
  const [loaderStep, setLoaderStep] = useState(1)

  // Meeting details popup states
  const [showMeetingDetails, setShowMeetingDetails] = useState(false)
  const [selectedDateMeetings, setSelectedDateMeetings] = useState([])
  const [selectedDateKey, setSelectedDateKey] = useState(null)
  const [calendarKey, setCalendarKey] = useState(0) // Key to force calendar refresh

  // Generate demo meeting link
  const generateMeetingLink = async (details) => {
    try {
      setShowLoader(true)
      setLoaderStep(1)

      // Validate meeting details
      const validationErrors = meetingService.validateMeetingDetails(details)
      if (validationErrors.length > 0) {
        setShowLoader(false)
        showError(`Validation errors: ${validationErrors.join(', ')}`)
        return
      }

      // Simulate step progression
      const stepInterval = setInterval(() => {
        setLoaderStep(prev => {
          if (prev < 4) {
            return prev + 1
          }
          return prev
        })
      }, 800)

      // Call the meeting service
      const result = await meetingService.generateMeetingLink(details)

      clearInterval(stepInterval)
      setLoaderStep(4)

      if (result.success) {
        setGeneratedMeetingLink(result.meetingLink)
        setShowLoader(false)
        setShowLinkDisplay(true)
        console.log('Meeting generated:', result.meetingLink)

        // Refresh calendar to show new meeting
        setCalendarKey(prev => prev + 1)
      } else {
        throw new Error(result.error || "We couldn't generate the meeting link. Please try again.")
      }

    } catch (error) {
      console.error('Error generating meeting link:', error)
      setShowLoader(false)
      showError(error.message || `We couldn't generate the meeting link. Please try again.`)
    }
  }

  const handleDateClick = async (dateKey) => {
    try {
      setSelectedDateKey(dateKey)
      setShowMeetingDetails(true)
      // The popup will fetch meetings if not provided
      const result = await meetingService.getMeetingsByDate(dateKey)
      if (result.success) {
        setSelectedDateMeetings(result.meetings || [])
      }
    } catch (error) {
      console.error('Error fetching meetings for date:', error)
      setSelectedDateMeetings([])
    }
  }

  const handleCloseMeetingDetails = () => {
    setShowMeetingDetails(false)
    setSelectedDateMeetings([])
    setSelectedDateKey(null)
  }

  const handleMeetingDeleted = async () => {
    // Refresh calendar to reflect deleted meeting
    setCalendarKey(prev => prev + 1)
    // Reload meetings for the selected date if popup is still open
    if (selectedDateKey && showMeetingDetails) {
      try {
        const result = await meetingService.getMeetingsByDate(selectedDateKey)
        if (result.success) {
          setSelectedDateMeetings(result.meetings || [])
        }
      } catch (error) {
        console.error('Error refreshing meetings after deletion:', error)
      }
    }
  }

  const handleScheduleMeeting = () => {
    setShowSchedulingModal(true)
  }

  const handleConnectGoogle = async () => {
    try {
      await meetingService.beginOAuthFlow()
    } catch (error) {
      console.error('Failed to initiate Google authorization:', error)
      showError(error.message || "We couldn't connect to Google. Please try again.")
    }
  }

  const handleSchedulingSubmit = (details) => {
    setMeetingDetails(details)
    setShowSchedulingModal(false)
    setShowConfirmationModal(true)
  }

  const handleConfirmationConfirm = () => {
    setShowConfirmationModal(false)
    generateMeetingLink(meetingDetails)
  }

  const handleConfirmationCancel = () => {
    setShowConfirmationModal(false)
    setShowSchedulingModal(true)
  }

  const handleLinkDisplayClose = () => {
    setShowLinkDisplay(false)
    setMeetingDetails(null)
    setGeneratedMeetingLink("")
    setLoaderStep(1)
  }

  const handleScheduleAnother = () => {
    setShowLinkDisplay(false)
    setMeetingDetails(null)
    setGeneratedMeetingLink("")
    setLoaderStep(1)
    setShowSchedulingModal(true)
  }

  return (
    <div className="flex min-h-screen bg-[#111111] text-white font-['Poppins'] overflow-x-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />

        <main className="flex-1 p-2 sm:p-4 md:p-6 lg:p-8 overflow-auto">
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
            <div className="flex-1 min-w-0">
              <MeetingsHeader searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
              <ScheduleMeetingCard onScheduleMeeting={handleScheduleMeeting} onConnectGoogle={handleConnectGoogle} />
            </div>

            <div className="lg:w-80 w-full">
              <CalendarWidget
                key={calendarKey}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                onDateClick={handleDateClick}
              />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 mt-4 sm:mt-6">
            <div className="flex-1 min-w-0">
              <SessionsTable
                searchTerm={searchTerm}
                selectedDate={selectedDateKey}
                refreshTrigger={calendarKey}
              />
            </div>

            <div className="lg:w-80 w-full">
              <UpcomingMeetings refreshTrigger={calendarKey} />
            </div>
          </div>
        </main>
      </div>

      {/* Meeting Scheduling Modals */}
      <MeetingSchedulingModal
        isOpen={showSchedulingModal}
        onClose={() => setShowSchedulingModal(false)}
        onSchedule={handleSchedulingSubmit}
      />

      <MeetingConfirmationModal
        isOpen={showConfirmationModal}
        meetingDetails={meetingDetails}
        onConfirm={handleConfirmationConfirm}
        onCancel={handleConfirmationCancel}
      />

      <MeetingLoader
        isVisible={showLoader}
        currentStep={loaderStep}
        totalSteps={4}
      />

      <MeetingLinkDisplay
        isVisible={showLinkDisplay}
        meetingDetails={meetingDetails}
        meetingLink={generatedMeetingLink}
        onClose={handleLinkDisplayClose}
        onScheduleAnother={handleScheduleAnother}
      />

      <MeetingDetailsPopup
        isOpen={showMeetingDetails}
        meetings={selectedDateMeetings}
        selectedDate={selectedDateKey}
        onClose={handleCloseMeetingDetails}
        onMeetingDeleted={handleMeetingDeleted}
      />
    </div>
  )
}

export default Meetings
