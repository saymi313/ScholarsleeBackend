import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import menteeMeetingService from "./menteeMeetingService"

const statusStyles = {
  loading: "text-gray-300",
  success: "text-green-400",
  error: "text-red-400"
}

const MenteeGoogleMeetCallback = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState("loading")
  const [message, setMessage] = useState("Finalizing Google authorization...")

  useEffect(() => {
    const error = searchParams.get("error")
    const code = searchParams.get("code")

    if (error) {
      setStatus("error")
      setMessage(`Authorization failed: ${decodeURIComponent(error)}`)
      return
    }

    if (!code) {
      setStatus("error")
      setMessage("Missing authorization code in the callback URL.")
      return
    }

    const completeAuthorization = async () => {
      try {
        setStatus("loading")
        setMessage("Retrieving Google tokens...")

        const response = await menteeMeetingService.processOAuthCallback(code)

        if (!response.success) {
          throw new Error(response.message || "We couldn't connect Google Meet. Please try again.")
        }

        setStatus("success")
        setMessage("Google Meet connected successfully! Redirecting to meetings...")

        setTimeout(() => {
          navigate("/mentees/bookings?tab=meetings", { replace: true })
        }, 2000)
      } catch (err) {
        console.error("Google Meet OAuth callback error:", err)
        setStatus("error")
        setMessage(err.message || "We couldn't connect Google Meet. Please try again.")
      }
    }

    completeAuthorization()
  }, [navigate, searchParams])

  return (
    <div className="min-h-screen bg-[#111111] text-white flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-8 text-center shadow-xl">
        <div className="flex flex-col items-center gap-4">
          <div className={`text-xl font-semibold ${statusStyles[status]}`}>Google Meet Integration</div>
          <p className="text-sm text-gray-400 leading-relaxed">{message}</p>
          {status === "success" && (
            <div className="text-xs text-gray-500">You will be redirected automatically.</div>
          )}
          {status === "error" && (
            <button
              type="button"
              onClick={() => navigate("/mentees/bookings?tab=meetings", { replace: true })}
              className="mt-4 px-4 py-2 bg-[#5D38DE] text-white rounded-lg hover:bg-[#4d2bc4] transition-colors"
            >
              Back to Meetings
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default MenteeGoogleMeetCallback
