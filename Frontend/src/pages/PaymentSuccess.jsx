import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { CheckCircle, Loader2, XCircle } from "lucide-react"
import { paymentAPI } from "../utils/api"
import { useCheckout } from "../context/CheckoutContext"

export default function PaymentSuccess() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { clearCheckout } = useCheckout()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [payment, setPayment] = useState(null)

  useEffect(() => {
    const sessionId = searchParams.get("session_id")
    if (!sessionId) {
      setError("Payment session not found. Please try again.")
      setLoading(false)
      return
    }

    const verify = async () => {
      try {
        const response = await paymentAPI.verifySession(sessionId)
        if (response.data.success) {
          setPayment(response.data.data.payment)
          clearCheckout()
        } else {
          setError(response.data.message || "Unable to verify payment")
        }
      } catch (verificationError) {
        setError(verificationError.message || "Unable to verify payment")
      } finally {
        setLoading(false)
      }
    }

    verify()
  }, [searchParams, clearCheckout])

  const handleViewBookings = () => {
    navigate("/mentees/bookings")
  }

  const handleExploreMore = () => {
    navigate("/mentees/services")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-[var(--brand,#5D38DE)] mx-auto mb-4" />
          <p className="text-gray-600">Verifying your payment...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleExploreMore}
            className="px-6 py-3 bg-[var(--brand,#5D38DE)] text-white rounded-lg hover:opacity-90 transition-colors"
          >
            Browse services
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center space-y-6">
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Payment successful!</h2>
          <p className="text-gray-600 mt-2">
            Your booking is now confirmed. We have sent a confirmation email with all the details.
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 text-left space-y-2">
          <p className="text-sm text-gray-500">Booking reference</p>
          <p className="text-base font-semibold text-gray-900">
            {payment?.bookingId?._id || payment?.metadata?.bookingRef || "Pending assignment"}
          </p>
          <p className="text-sm text-gray-500">Amount paid</p>
          <p className="text-base font-semibold text-gray-900">${payment?.amount?.toFixed(2)}</p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleViewBookings}
            className="w-full px-6 py-3 bg-[var(--brand,#5D38DE)] text-white rounded-lg hover:opacity-90 transition-colors"
          >
            View my bookings
          </button>
          <button
            onClick={handleExploreMore}
            className="w-full px-6 py-3 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Explore more services
          </button>
        </div>
      </div>
    </div>
  )
}

