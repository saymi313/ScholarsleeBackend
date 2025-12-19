import { useCheckout } from '../../../context/CheckoutContext'

function InfoLine({ label, value, strong }) {
  return (
    <div className="flex items-center justify-between">
      <span className={`text-sm ${strong ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>{label}</span>
      <span className={`text-sm ${strong ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>{value}</span>
    </div>
  )
}

export default function CartSummary() {
  const { checkoutData } = useCheckout()
  const { service, selectedPackage } = checkoutData || {}

  if (!service || !selectedPackage) {
    return (
      <aside className="rounded-xl border bg-card p-6 shadow-sm">
        <h3 className="text-base font-semibold text-foreground">Review your cart</h3>
        <p className="mt-4 text-sm text-muted-foreground">
          Select a service package to view the summary and continue to checkout.
        </p>
      </aside>
    )
  }

  const subtotal = selectedPackage.price || 0
  const total = subtotal

  return (
    <aside className="rounded-xl border bg-card p-6 shadow-sm">
      <h3 className="text-base font-semibold text-foreground">Review your cart</h3>

      <div className="mt-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h4 className="font-semibold text-foreground leading-tight">{selectedPackage.name?.toUpperCase()} PACKAGE</h4>
            <p className="mt-1 text-xs text-muted-foreground max-w-xs">{service.title}</p>
            <ul className="mt-4 space-y-2 text-xs text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="text-[var(--brand)]">•</span>
                {selectedPackage.duration ? `${selectedPackage.duration} min` : 'Flexible duration'}
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[var(--brand)]">•</span>
                {selectedPackage.calls ? `${selectedPackage.calls} call(s)` : 'Includes messaging support'}
              </li>
              {selectedPackage.features?.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="text-[var(--brand)]">•</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          <div className="text-right shrink-0">
            <div className="text-lg font-semibold text-foreground">${subtotal.toFixed(2)}</div>
          </div>
        </div>

        <div className="space-y-3">
          <InfoLine label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
          <InfoLine label="Platform fee" value="Included" />
          <hr className="my-2 border-border" />
          <InfoLine label="Total" value={`$${total.toFixed(2)}`} strong />
        </div>

        <p className="text-xs text-muted-foreground">
          Payments are handled securely via Stripe. Your card details are never stored on Scholarslee servers.
        </p>
      </div>
    </aside>
  )
}