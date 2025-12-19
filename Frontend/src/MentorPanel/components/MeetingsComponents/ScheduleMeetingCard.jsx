import { useState } from "react"
import { Info } from "lucide-react"

const ScheduleMeetingCard = ({ onScheduleMeeting, onConnectGoogle }) => {
  const [showHelp, setShowHelp] = useState(false)

  return (
    <div className="bg-[#242424] rounded-xl p-4 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
      <div className="flex-1 min-w-0">
        <div className="flex items-start sm:items-center justify-between gap-3 mb-2">
          <h2 className="text-xl sm:text-2xl font-semibold text-white">Schedule a meeting</h2>
          <button
            type="button"
            onClick={() => setShowHelp((prev) => !prev)}
            className="flex items-center justify-center p-1.5 text-gray-300 border border-gray-600/60 rounded-full hover:text-white hover:border-gray-400 transition-colors w-fit"
            aria-expanded={showHelp}
            title="How to schedule a meeting"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
        <p className="text-gray-400 text-sm mb-3 sm:mb-4">Schedule a meeting with your students via Google Meet</p>
        {showHelp && (
          <div className="mb-3 sm:mb-4 text-xs sm:text-sm text-gray-300 bg-[#1f1f1f] border border-[#323232] rounded-lg p-3">
            <p className="font-medium text-white mb-1">Steps:</p>
            <ol className="list-decimal list-inside space-y-1 text-gray-300/90">
              <li>Connect Google Calendar to authorise Google Meet access.</li>
              <li>Choose <span className="text-white">Schedule Meeting</span> to pick time and details.</li>
              <li>Share the generated Meet link with your mentee.</li>
            </ol>
          </div>
        )}
        <div className="flex flex-col gap-2">
          <button
            onClick={onScheduleMeeting}
            className="px-2 py-1 bg-[#5D38DE] text-white rounded-lg hover:bg-[#4d2bc4] transition-colors text-xs font-medium whitespace-nowrap w-full"
          >
            Schedule Meeting
          </button>
          <button
            onClick={onConnectGoogle}
            className="px-2 py-1 bg-transparent border border-[#5D38DE] text-[#5D38DE] rounded-lg hover:bg-[#5D38DE]/10 transition-colors text-xs font-medium whitespace-nowrap w-full"
          >
            Connect Google Calendar
          </button>
        </div>
      </div>

      <div className="hidden sm:flex sm:w-64 sm:h-48 items-center justify-center mt-3 md:mt-0 ml-4 sm:ml-6">
        <img
          src="/meeting.png"
          alt="Schedule Meeting Illustration"
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  )
}

export default ScheduleMeetingCard
