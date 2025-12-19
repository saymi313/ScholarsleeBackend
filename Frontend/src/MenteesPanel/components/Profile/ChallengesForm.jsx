import { useState } from "react"

export default function ChallengesForm({ value = [], onChange }) {
  const [newChallenge, setNewChallenge] = useState("")
  const [newChallengeType, setNewChallengeType] = useState("academic")

  const challengeTypes = [
    { value: "academic", label: "Academic" },
    { value: "career", label: "Career" },
    { value: "personal", label: "Personal" },
    { value: "technical", label: "Technical" },
    { value: "language", label: "Language" },
    { value: "time-management", label: "Time Management" }
  ]

  const popularChallenges = [
    "Difficulty understanding concepts", "Time management issues", "Lack of motivation",
    "Language barriers", "Technical skills gap", "Career direction uncertainty",
    "Study habits", "Exam anxiety", "Research methodology", "Writing skills",
    "Presentation skills", "Networking", "Job search", "Interview preparation"
  ]

  const addChallenge = () => {
    if (newChallenge.trim() && !value.some(challenge => challenge.text === newChallenge.trim())) {
      const newChallengeObj = { text: newChallenge.trim(), type: newChallengeType, id: Date.now() }
      onChange([...value, newChallengeObj])
      setNewChallenge("")
    }
  }

  const removeChallenge = (id) => {
    onChange(value.filter(challenge => challenge.id !== id))
  }

  const addPopularChallenge = (challengeText) => {
    if (!value.some(challenge => challenge.text === challengeText)) {
      onChange([...value, { text: challengeText, type: newChallengeType, id: Date.now() }])
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          value={newChallenge}
          onChange={(e) => setNewChallenge(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addChallenge()}
          className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5D38DE]"
          placeholder="Add a challenge you're facing..."
        />
        <select
          value={newChallengeType}
          onChange={(e) => setNewChallengeType(e.target.value)}
          className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5D38DE]"
        >
          {challengeTypes.map(type => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>
        <button
          onClick={addChallenge}
          disabled={!newChallenge.trim()}
          className="px-4 py-2 bg-[#5D38DE] text-white rounded-lg text-sm font-medium hover:bg-[#4a2bb8] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add
        </button>
      </div>

      {value.length > 0 && (
        <div className="space-y-2">
          {value.map((challenge) => (
            <div key={challenge.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
              <div className="flex items-center gap-2">
                <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded-full">
                  {challengeTypes.find(t => t.value === challenge.type)?.label}
                </span>
                <span className="text-sm text-gray-700">{challenge.text}</span>
              </div>
              <button
                onClick={() => removeChallenge(challenge.id)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      <div>
        <p className="text-sm text-gray-600 mb-2">Common challenges:</p>
        <div className="flex flex-wrap gap-2">
          {popularChallenges.map((challenge) => (
            <button
              key={challenge}
              onClick={() => addPopularChallenge(challenge)}
              disabled={value.some(c => c.text === challenge)}
              className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-orange-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {challenge}
            </button>
          ))}
        </div>
      </div>

      {value.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-4">No challenges added yet. Add challenges above or select from common options.</p>
      )}
    </div>
  )
}
