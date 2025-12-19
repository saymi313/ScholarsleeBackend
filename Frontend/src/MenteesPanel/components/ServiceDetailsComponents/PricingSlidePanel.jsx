"use client"

import React from "react"
import { useNavigate } from "react-router-dom"
import { useCheckout } from "../../../context/CheckoutContext"

export default function PricingSidePanel({
  service,
  onBookNow,
  selectedPackageId,
  onPackageSelect,
}) {
  const navigate = useNavigate()
  const { setServiceForCheckout } = useCheckout()
  const [internalActiveId, setInternalActiveId] = React.useState(service.packages?.[0]?._id || null)

  React.useEffect(() => {
    if (service?.packages?.length) {
      setInternalActiveId(service.packages[0]._id)
    }
  }, [service?._id])

  const activeId = selectedPackageId ?? internalActiveId

  const handleSelectPackage = (pkgId) => {
    if (onPackageSelect) {
      onPackageSelect(pkgId)
    } else {
      setInternalActiveId(pkgId)
    }
  }

  if (!service || !service.packages || service.packages.length === 0) {
    return (
      <aside className="rounded-lg border bg-background px-10 md:px-10 py-2">
        <div className="py-4 space-y-4">
          <p className="text-sm text-muted-foreground">No packages available</p>
        </div>
      </aside>
    )
  }

  const activePackage = service.packages.find(pkg => pkg._id === activeId) || service.packages[0]

  const handleContinue = () => {
    if (!service || !activePackage) return

    setServiceForCheckout(service, activePackage)
    navigate("/pricings")
  }

  return (
    <aside className="rounded-lg border bg-background px-10 md:px-10 py-2">
      <div className="flex border-b">
        {service.packages.map((pkg) => (
          <button
            key={pkg._id}
            onClick={() => handleSelectPackage(pkg._id)}
            className={`px-4 py-2 text-sm font-medium -mb-px border-b-2 ${
              activePackage?._id === pkg._id
                ? "border-[color:var(--brand,#5D38DE)] text-foreground"
                : "border-transparent text-muted-foreground"
            }`}
            aria-current={activePackage?._id === pkg._id ? "page" : undefined}
          >
            {pkg.name}
          </button>
        ))}
      </div>

      <div className="py-4 space-y-4 ">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-semibold text-foreground">{activePackage.name.toUpperCase()} PACKAGE</h3>
            <p className="text-sm text-muted-foreground">
              {service.title} - {activePackage.name} package
            </p>
          </div>
          <div className="text-right text-foreground font-semibold">${activePackage.price}</div>
        </div>

        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <div className="inline-flex items-center gap-2">
            {/* calendar icon */}
            <svg className="h-4 w-4 text-foreground/70" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
            <span>{activePackage.duration}</span>
          </div>
          <div className="inline-flex items-center gap-2">
            {/* phone icon */}
            <svg className="h-4 w-4 text-foreground/70" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M22 16.92v2a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.11 3.2 2 2 0 0 1 4.1 1h2a2 2 0 0 1 2 1.72 12.7 12.7 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11l-1 1a16 16 0 0 0 6 6l1-1a2 2 0 0 1 2.11-.45 12.7 12.7 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <span>{activePackage.calls || 0} calls</span>
          </div>
        </div>

        <ul className="space-y-2">
          {activePackage.features && activePackage.features.map((feature, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              {/* check */}
              <svg className="h-4 w-4 text-[color:var(--brand,#5D38DE)] mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-7.25 7.25a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414l2.293 2.293 6.543-6.543a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <button
          onClick={onBookNow || handleContinue}
          className="w-full inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white"
          style={{ backgroundColor: "var(--brand, #5D38DE)" }}
        >
          {onBookNow ? 'Book Now' : 'Continue'}
          <svg className="ml-2 h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M5 12h14M13 5l7 7-7 7" />
          </svg>
        </button>

        <button className="w-full text-sm text-[color:var(--brand,#5D38DE)] underline underline-offset-4">
          Compare Packages
        </button>
      </div>
    </aside>
  )
}
