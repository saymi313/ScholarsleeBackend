import { useState } from "react"

export default function BudgetForm({ value = {}, onChange }) {
  const [errors, setErrors] = useState({})
  const currencies = [
    { code: "USD", symbol: "$", name: "US Dollar" },
    { code: "EUR", symbol: "€", name: "Euro" },
    { code: "GBP", symbol: "£", name: "British Pound" },
    { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
    { code: "AUD", symbol: "A$", name: "Australian Dollar" },
    { code: "JPY", symbol: "¥", name: "Japanese Yen" },
    { code: "PKR", symbol: "₨", name: "Pakistani Rupee" },
    { code: "INR", symbol: "₹", name: "Indian Rupee" }
  ]

  const budgetRanges = [
    { label: "Under $500", value: 500 },
    { label: "$500 - $1,000", value: 1000 },
    { label: "$1,000 - $2,500", value: 2500 },
    { label: "$2,500 - $5,000", value: 5000 },
    { label: "$5,000 - $10,000", value: 10000 },
    { label: "Over $10,000", value: 15000 }
  ]

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Budget Range</label>
        <select
          value={value.budget || ""}
          onChange={(e) => onChange({ ...value, budget: parseInt(e.target.value) || 0 })}
          className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5D38DE]"
        >
          <option value="">Select your budget range</option>
          {budgetRanges.map((range) => (
            <option key={range.value} value={range.value}>{range.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
        <select
          value={value.budgetCurrency || "USD"}
          onChange={(e) => onChange({ ...value, budgetCurrency: e.target.value })}
          className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5D38DE]"
        >
          {currencies.map((currency) => (
            <option key={currency.code} value={currency.code}>
              {currency.symbol} {currency.code} - {currency.name}
            </option>
          ))}
        </select>
      </div>

      {value.budget > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            <strong>Selected Budget:</strong> {currencies.find(c => c.code === value.budgetCurrency)?.symbol}{value.budget.toLocaleString()} {value.budgetCurrency}
          </p>
        </div>
      )}
    </div>
  )
}
