"use client"

import { useMemo, useState, useEffect } from "react"
import PaymentMethods from "./PaymentMethods"
import ReactCountryFlag from "react-country-flag"
import { useCheckout } from "../../../context/CheckoutContext"
import { useAuth } from "../../../context/AuthContext"
import { paymentAPI } from "../../../utils/api"

function Input({ label, required, ...props }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-foreground">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      <input
        {...props}
        className={
          "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none transition " +
          "border-border focus:ring-2 focus:ring-[var(--brand)]"
        }
      />
    </label>
  )
}

function Select({ label, required, children, ...props }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-foreground">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      <select
        {...props}
        className={
          "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none transition " +
          "border-border focus:ring-2 focus:ring-[var(--brand)]"
        }
      >
        {children}
      </select>
    </label>
  )
}

export default function CheckoutForm() {
  const { checkoutData, setCheckoutData } = useCheckout()
  const { user } = useAuth()
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [phoneCountryCode, setPhoneCountryCode] = useState("+1")
  const [country, setCountry] = useState("us")
  const [scheduledDate, setScheduledDate] = useState("")
  const [duration, setDuration] = useState("")
  const [notes, setNotes] = useState("")
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const countryOptions = useMemo(
    () => [
      { code: "pk", name: "Pakistan" },
      { code: "us", name: "United States" },
      { code: "de", name: "Germany" },
      { code: "gb", name: "United Kingdom" },
      { code: "in", name: "India" },
      { code: "ca", name: "Canada" },
      { code: "au", name: "Australia" },
    ],
    [],
  )

  const phoneCountryCodes = useMemo(
    () => [
        { code: "pk", name: "Pakistan", phoneCode: "+92", mask: "XXX XXXX XXX" },
      { code: "us", name: "United States", phoneCode: "+1", mask: "(XXX) XXX-XXXX" },
      { code: "de", name: "Germany", phoneCode: "+49", mask: "XX XXX XXXX" },
      { code: "gb", name: "United Kingdom", phoneCode: "+44", mask: "XXXX XXX XXX" },
      { code: "in", name: "India", phoneCode: "+91", mask: "XXXX XXXXXX" },
      { code: "ca", name: "Canada", phoneCode: "+1", mask: "(XXX) XXX-XXXX" },
      { code: "au", name: "Australia", phoneCode: "+61", mask: "XXX XXX XXX" },
    ],
    [],
  )

  const onPhoneCountryCodeChange = (value) => {
    setPhoneCountryCode(value)
    const countryData = phoneCountryCodes.find(c => c.phoneCode === value)
    if (countryData) {
      setCountry(countryData.code)
    }
    setPhone("") // Reset phone when country code changes
  }

  // Prefill user details
  useEffect(() => {
    if (user) {
      const firstName = user.profile?.firstName || ""
      const lastName = user.profile?.lastName || ""
      setFullName(`${firstName} ${lastName}`.trim())
      setEmail(user.email || "")
      if (user.profile?.phone) {
        setPhone(user.profile.phone)
      }
      if (user.profile?.country) {
        setCountry(user.profile.country.toLowerCase())
      }
    }
  }, [user])

  // Sync initial country code with country selection
  useEffect(() => {
    const match = phoneCountryCodes.find(c => c.code === country)
    if (match) {
      setPhoneCountryCode(match.phoneCode)
    }
  }, [country, phoneCountryCodes])

  // Sync checkout data
  useEffect(() => {
    if (checkoutData) {
      setScheduledDate(checkoutData.scheduledDate || "")
      setDuration(
        checkoutData.duration && !Number.isNaN(Number(checkoutData.duration))
          ? checkoutData.duration
          : checkoutData.selectedPackage?.duration || ""
      )
      setNotes(checkoutData.notes || "")
    }
  }, [checkoutData])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!checkoutData?.service || !checkoutData?.selectedPackage) {
      setError("Please select a service package before proceeding.")
      return
    }

    if (!scheduledDate) {
      setError("Please select a preferred schedule.")
      return
    }

    if (!agreeTerms) {
      setError("You must accept the Terms and Conditions to continue.")
      return
    }

    const isoDate = new Date(scheduledDate).toISOString()

    // Persist selection in context for redirect flow
    setCheckoutData((prev) => ({
      ...prev,
      scheduledDate,
      duration,
      notes,
    }))

    setLoading(true)
    try {
      const response = await paymentAPI.createCheckoutSession({
        serviceId: checkoutData.service._id,
        packageId: checkoutData.selectedPackage._id,
        scheduledDate: isoDate,
        duration: duration ? Number(duration) : undefined,
        notes,
      })

      const checkoutUrl = response?.data?.data?.url
      if (checkoutUrl) {
        window.location.href = checkoutUrl
      } else {
        throw new Error("Unable to create Stripe checkout session")
      }
    } catch (submitError) {
      setError(submitError.message || "Failed to start payment. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const isDisabled = !checkoutData?.service || !checkoutData?.selectedPackage

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div>
        <h2 className="text-xl font-semibold text-foreground">Checkout</h2>
        <p className="mt-1 text-sm text-muted-foreground">Card options</p>
        <div className="mt-3">
          <PaymentMethods />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5">
        <Input
          label="Full name"
          required
          placeholder="Enter full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          disabled={isDisabled}
        />
        <Input
          type="email"
          label="Email address"
          required
          placeholder="Enter email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isDisabled}
        />

        <div className="block">
          <span className="mb-2 block text-sm font-medium text-foreground">
            Phone number <span className="text-red-500">*</span>
          </span>
          <div className="flex">
            <div className="relative flex-shrink-0">
              <select
                value={phoneCountryCode}
                onChange={(e) => onPhoneCountryCodeChange(e.target.value)}
                className="w-auto rounded-l-md rounded-r-none border border-r-1 bg-background pl-10  pr-2 py-2 text-sm outline-none transition border-border focus:ring-2 focus:ring-[var(--brand)]"
              >
                {phoneCountryCodes.map((c) => (
                  <option key={c.phoneCode} value={c.phoneCode}>
                    {c.phoneCode} {c.name}
                  </option>
                ))}
              </select>
              <div className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none flex items-center">
                <ReactCountryFlag
                  countryCode={phoneCountryCodes.find(c => c.phoneCode === phoneCountryCode)?.code || "us"}
                  svg
                  style={{
                    width: '16px',
                    height: '12px',
                  }}
                  title={phoneCountryCodes.find(c => c.phoneCode === phoneCountryCode)?.name}
                />
              </div>
            </div>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={phoneCountryCodes.find(c => c.phoneCode === phoneCountryCode)?.mask || "Phone number"}
              className="w-full rounded-r-md rounded-l-none border border-l-0 bg-background px-3 py-2 text-sm outline-none transition border-border focus:ring-2 focus:ring-[var(--brand)]"
              disabled={isDisabled}
            />
          </div>
        </div>

        <div className="block">
          <span className="mb-2 block text-sm font-medium text-foreground">
            Country <span className="text-red-500">*</span>
          </span>
          <div className="relative">
            <select
              value={country} 
              onChange={(e) => {
                const selectedCountry = e.target.value
                setCountry(selectedCountry)
                const countryData = phoneCountryCodes.find(c => c.code === selectedCountry)
                if (countryData) {
                  setPhoneCountryCode(countryData.phoneCode)
                }
              }}
              className="w-full rounded-md border bg-background pl-10 pr-8 py-2 text-sm outline-none transition border-border focus:ring-2 focus:ring-[var(--brand)]"
              disabled={isDisabled}
            >
              {countryOptions.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center">
              <ReactCountryFlag
                countryCode={country}
                svg
                style={{
                  width: '14px',
                  height: '10px',
                }}
                title={countryOptions.find(c => c.code === country)?.name}
              />
            </div>
          </div>
        </div>

        <Input
          label="Preferred session date & time"
          required
          type="datetime-local"
          min={new Date().toISOString().slice(0, 16)}
          value={scheduledDate}
          onChange={(e) => setScheduledDate(e.target.value)}
          disabled={isDisabled}
        />

        <Input
          label="Session duration (minutes)"
          type="number"
          min={30}
          step={15}
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          disabled={isDisabled}
        />

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-foreground">Notes for your mentor</span>
          <textarea
            rows={4}
            placeholder="Share context or goals for this session..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none transition border-border focus:ring-2 focus:ring-[var(--brand)]"
            disabled={isDisabled}
          />
        </label>

        <label className="flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border-border"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            disabled={isDisabled}
          />
          <span className="text-muted-foreground">I have read and agree to the Terms and Conditions.</span>
        </label>

        {error && (
          <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-md p-3">{error}</p>
        )}

        <button
          type="submit"
          disabled={isDisabled || loading}
          className="w-full rounded-md bg-[var(--brand)] px-4 py-3 text-sm font-semibold text-white shadow-sm hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Redirecting to Stripe...' : 'Proceed to payment'}
        </button>
      </div>
    </form>
  )
}
