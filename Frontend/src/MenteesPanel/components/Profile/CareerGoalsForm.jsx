import { useState } from "react"

export default function CareerGoalsForm({ value = [], onChange }) {
  const [newGoal, setNewGoal] = useState("")
  const [newGoalType, setNewGoalType] = useState("short-term")

  const goalTypes = [
    { value: "short-term", label: "Short-term (1-2 years)" },
    { value: "medium-term", label: "Medium-term (3-5 years)" },
    { value: "long-term", label: "Long-term (5+ years)" }
  ]

  const popularGoals = [
    "Get a job in tech", "Start my own business", "Become a manager", 
    "Switch careers", "Get promoted", "Learn new skills", "Build a network",
    "Work remotely", "Travel for work", "Mentor others", "Write a book",
    "Speak at conferences", "Start a side project", "Get certified"
  ]

  const addGoal = () => {
    if (newGoal.trim() && !value.some(goal => goal.text === newGoal.trim())) {
      const newGoalObj = { text: newGoal.trim(), type: newGoalType, id: Date.now() }
      onChange([...value, newGoalObj])
      setNewGoal("")
    }
  }

  const removeGoal = (id) => {
    onChange(value.filter(goal => goal.id !== id))
  }

  const addPopularGoal = (goalText) => {
    if (!value.some(goal => goal.text === goalText)) {
      onChange([...value, { text: goalText, type: newGoalType, id: Date.now() }])
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          value={newGoal}
          onChange={(e) => setNewGoal(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addGoal()}
          className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5D38DE]"
          placeholder="Add a career goal..."
        />
        <select
          value={newGoalType}
          onChange={(e) => setNewGoalType(e.target.value)}
          className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5D38DE]"
        >
          {goalTypes.map(type => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>
        <button
          onClick={addGoal}
          disabled={!newGoal.trim()}
          className="px-4 py-2 bg-[#5D38DE] text-white rounded-lg text-sm font-medium hover:bg-[#4a2bb8] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add
        </button>
      </div>

      {value.length > 0 && (
        <div className="space-y-2">
          {value.map((goal) => (
            <div key={goal.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
              <div className="flex items-center gap-2">
                <span className="text-xs bg-[#5D38DE] text-white px-2 py-1 rounded-full">
                  {goalTypes.find(t => t.value === goal.type)?.label}
                </span>
                <span className="text-sm text-gray-700">{goal.text}</span>
              </div>
              <button
                onClick={() => removeGoal(goal.id)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      <div>
        <p className="text-sm text-gray-600 mb-2">Popular career goals:</p>
        <div className="flex flex-wrap gap-2">
          {popularGoals.map((goal) => (
            <button
              key={goal}
              onClick={() => addPopularGoal(goal)}
              disabled={value.some(g => g.text === goal)}
              className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-[#5D38DE] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {goal}
            </button>
          ))}
        </div>
      </div>

      {value.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-4">No career goals added yet. Add goals above or select from popular options.</p>
      )}
    </div>
  )
}
