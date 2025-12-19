import React, { useState } from "react"

const methods = [
  { name: "Mastercard", icon: "/master-card.svg", key: "mastercard" },
  { name: "VISA", icon: "/visa.svg", key: "visa" },
  { name: "PayPal", icon: "/paypal.svg", key: "paypal" },
  { name: "Apple Pay", icon: "/apple-pay.svg", key: "apple-pay" }
]

export default function PaymentMethods() {
  const [selectedMethod, setSelectedMethod] = useState("")
  
  return (
    <div className="flex flex-wrap gap-3">
      {methods.map((m) => (
        <img
          key={m.name}
          onClick={() => setSelectedMethod(m.key)}
          src={m.icon}
          alt={m.name}
          className={`w-16 h-12 cursor-pointer transition-all duration-200 ${
            selectedMethod === m.key 
              ? "border-[1px] border-blue-500" 
              : "hover:opacity-80"
          }`}
          aria-label={m.name}
        />
      ))}
    </div>
  )
}
