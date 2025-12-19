import { Video, Calendar, Link, CheckCircle } from "lucide-react"

const MeetingLoader = ({ isVisible, currentStep, totalSteps }) => {
  if (!isVisible) return null

  const steps = [
    { icon: Video, label: "Connecting to Google Meet", description: "Initializing Google Meet API" },
    { icon: Calendar, label: "Creating calendar event", description: "Adding meeting to Google Calendar" },
    { icon: Link, label: "Generating meeting link", description: "Creating Google Meet link" },
    { icon: CheckCircle, label: "Meeting ready", description: "Google Meet session is ready" }
  ]

  const currentStepData = steps[currentStep - 1] || steps[0]
  const CurrentIcon = currentStepData.icon

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1a1a] rounded-2xl p-8 border border-[#2a2a2a] max-w-md w-full text-center">
        {/* Main Loader Animation */}
        <div className="relative mb-8">
          <div className="w-24 h-24 mx-auto relative">
            {/* Outer rotating ring */}
            <div className="absolute inset-0 border-4 border-[#5D38DE]/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-[#5D38DE] rounded-full animate-spin"></div>
            
            {/* Inner pulsing circle */}
            <div className="absolute inset-2 bg-[#5D38DE]/10 rounded-full animate-pulse"></div>
            
            {/* Center icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <CurrentIcon className="w-8 h-8 text-[#5D38DE] animate-bounce" />
            </div>
          </div>
        </div>

        {/* Step Information */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-white mb-2">{currentStepData.label}</h3>
          <p className="text-gray-400 text-sm">{currentStepData.description}</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-400">Step {currentStep} of {totalSteps}</span>
            <span className="text-xs text-gray-400">{Math.round((currentStep / totalSteps) * 100)}%</span>
          </div>
          <div className="w-full bg-[#242424] rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-[#5D38DE] to-[#8b5cf6] h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step Indicators */}
        <div className="flex justify-center space-x-2">
          {steps.map((step, index) => {
            const StepIcon = step.icon
            const isActive = index + 1 === currentStep
            const isCompleted = index + 1 < currentStep
            
            return (
              <div
                key={index}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isCompleted 
                    ? 'bg-green-500 text-white' 
                    : isActive 
                    ? 'bg-[#5D38DE] text-white' 
                    : 'bg-[#242424] text-gray-400'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <StepIcon className="w-4 h-4" />
                )}
              </div>
            )
          })}
        </div>

        {/* Loading Animation */}
        <div className="mt-6 flex justify-center space-x-1">
          <div className="w-2 h-2 bg-[#5D38DE] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-[#5D38DE] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-[#5D38DE] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>

        {/* Note */}
        <p className="text-xs text-gray-500 mt-4">
          This may take a few moments. Please don't close this window.
        </p>
      </div>
    </div>
  )
}

export default MeetingLoader
