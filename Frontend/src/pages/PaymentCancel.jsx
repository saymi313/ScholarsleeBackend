import { useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { AlertTriangle } from "lucide-react"
import { useCheckout } from "../context/CheckoutContext"

export default function PaymentCancel() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { checkoutData } = useCheckout()
  const [showRetryNotice, setShowRetryNotice] = useState(!checkoutData?.service)
  const serviceId = searchParams.get("service_id")

  const handleTryAgain = () => {
    if (checkoutData?.service) {
      navigate("/pricings")
    } else if (serviceId) {
      navigate(`/service-details/${serviceId}`)
    } else {
      navigate("/mentees/services")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center space-y-6">
        <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Payment cancelled</h2>
          <p className="text-gray-600 mt-2">
            Your Stripe payment session was cancelled. Your booking remains pending until payment is completed.
          </p>
        </div>

        {showRetryNotice && (
          <p className="text-sm text-yellow-800 bg-yellow-50 border border-yellow-100 rounded-md p-3">
            We could not restore your previous selection. Please pick your service again to restart the checkout flow.
          </p>
        )}

        <div className="flex flex-col gap-3">
          <button
            onClick={handleTryAgain}
            className="w-full px-6 py-3 bg-[var(--brand,#5D38DE)] text-white rounded-lg hover:opacity-90 transition-colors"
          >
            Try again
          </button>
          <button
            onClick={() => navigate("/mentees/services")}
            className="w-full px-6 py-3 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Browse services
          </button>
        </div>
      </div>
    </div>
  )
}

