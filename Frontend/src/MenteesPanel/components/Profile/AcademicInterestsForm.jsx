import { useState } from "react"

export default function AcademicInterestsForm({ value = [], onChange }) {
  const [newInterest, setNewInterest] = useState("")

  const popularInterests = [
    "Computer Science", "Data Science", "Artificial Intelligence", "Machine Learning",
    "Software Engineering", "Cybersecurity", "Web Development", "Mobile Development",
    "Business Administration", "Finance", "Marketing", "Economics", "Psychology",
    "Medicine", "Engineering", "Mathematics", "Physics", "Chemistry", "Biology",
    "Literature", "History", "Political Science", "International Relations",
    "Art", "Design", "Architecture", "Law", "Education", "Public Health"
  ]

  const addInterest = () => {
    if (newInterest.trim() && !value.includes(newInterest.trim())) {
      const newInterestValue = newInterest.trim()
      onChange([...value, newInterestValue])
      setNewInterest("")
    }
  }

  const removeInterest = (interest) => {
    onChange(value.filter(i => i !== interest))
  }

  const addPopularInterest = (interest) => {
    if (!value.includes(interest)) {
      onChange([...value, interest])
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          value={newInterest}
          onChange={(e) => setNewInterest(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addInterest()}
          className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5D38DE]"
          placeholder="Add an academic interest..."
        />
        <button
          onClick={addInterest}
          disabled={!newInterest.trim()}
          className="px-4 py-2 bg-[#5D38DE] text-white rounded-lg text-sm font-medium hover:bg-[#4a2bb8] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add
        </button>
      </div>

      {value.length > 0 && (
        <div className="space-y-2">
          {value.map((interest) => (
            <div key={interest} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
              <span className="text-sm text-gray-700">{interest}</span>
              <button
                onClick={() => removeInterest(interest)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      <div>
        <p className="text-sm text-gray-600 mb-2">Popular academic interests:</p>
        <div className="flex flex-wrap gap-2">
          {popularInterests.map((interest) => (
            <button
              key={interest}
              onClick={() => addPopularInterest(interest)}
              disabled={value.includes(interest)}
              className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-[#5D38DE] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {interest}
            </button>
          ))}
        </div>
      </div>

      {value.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-4">No academic interests added yet. Add interests above or select from popular options.</p>
      )}
    </div>
  )
}
