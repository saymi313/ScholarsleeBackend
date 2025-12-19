import { useState } from "react"

export default function TargetCountriesForm({ value = [], onChange }) {
  const [newCountry, setNewCountry] = useState("")

  const popularCountries = [
    "United States", "Canada", "United Kingdom", "Australia", "Germany", 
    "France", "Netherlands", "Sweden", "Norway", "Denmark", "Switzerland",
    "New Zealand", "Ireland", "Finland", "Austria", "Belgium", "Italy",
    "Spain", "Japan", "South Korea", "Singapore", "Hong Kong"
  ]

  const addCountry = () => {
    if (newCountry.trim() && !value.includes(newCountry.trim())) {
      const newCountryValue = newCountry.trim()
      onChange([...value, newCountryValue])
      setNewCountry("")
    }
  }

  const removeCountry = (country) => {
    onChange(value.filter(c => c !== country))
  }

  const addPopularCountry = (country) => {
    if (!value.includes(country)) {
      onChange([...value, country])
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          value={newCountry}
          onChange={(e) => setNewCountry(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addCountry()}
          className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5D38DE]"
          placeholder="Add a target country..."
        />
        <button
          onClick={addCountry}
          disabled={!newCountry.trim()}
          className="px-4 py-2 bg-[#5D38DE] text-white rounded-lg text-sm font-medium hover:bg-[#4a2bb8] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add
        </button>
      </div>

      {value.length > 0 && (
        <div className="space-y-2">
          {value.map((country) => (
            <div key={country} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
              <span className="text-sm text-gray-700">{country}</span>
              <button
                onClick={() => removeCountry(country)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      <div>
        <p className="text-sm text-gray-600 mb-2">Popular destinations:</p>
        <div className="flex flex-wrap gap-2">
          {popularCountries.map((country) => (
            <button
              key={country}
              onClick={() => addPopularCountry(country)}
              disabled={value.includes(country)}
              className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-[#5D38DE] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {country}
            </button>
          ))}
        </div>
      </div>

      {value.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-4">No target countries added yet. Add countries above or select from popular destinations.</p>
      )}
    </div>
  )
}
