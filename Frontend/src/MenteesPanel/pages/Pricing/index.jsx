import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import PricingHeader from "../../components/PricingComponents/PricingHeader"
import CheckoutForm from "../../components/PricingComponents/CheckoutForm"
import CartSummary from "../../components/PricingComponents/CartSummary"
import Header from "../../components/Shared/Header"
import { useCheckout } from "../../../context/CheckoutContext"

const BrandWrapper = ({ children }) => (
  <div style={{ ["--brand"]: "#5D38DE" }} className="min-h-[70vh]">
    {children}
  </div>
)

export default function PricingPage() {
  const navigate = useNavigate()
  const { checkoutData } = useCheckout()
  const missingSelection = !checkoutData?.service || !checkoutData?.selectedPackage

  useEffect(() => {
    if (missingSelection) {
      const timeout = setTimeout(() => {
        navigate("/mentees/services")
      }, 2500)
      return () => clearTimeout(timeout)
    }
  }, [missingSelection, navigate])

  return (
    <>
      <Header />
      <BrandWrapper>
        <main className="container mx-auto px-4 py-10">
          <PricingHeader />

          {missingSelection && (
            <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-900">
              Please select a mentor service package before proceeding to checkout. Redirecting you back to the services
              page...
            </div>
          )}

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <CheckoutForm />
            </div>

            <CartSummary />
          </section>
        </main>
      </BrandWrapper>
    </>
  )
}
