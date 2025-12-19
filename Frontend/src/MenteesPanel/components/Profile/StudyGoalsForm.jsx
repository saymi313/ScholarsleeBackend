import { useState } from "react"

export default function StudyGoalsForm({ value = [], onChange }) {
  const [newGoal, setNewGoal] = useState("")
  const [newGoalType, setNewGoalType] = useState("academic")

  const goalTypes = [
    { value: "academic", label: "Academic" },
    { value: "career", label: "Career" },
    { value: "personal", label: "Personal Development" },
    { value: "skill", label: "Skill Building" }
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

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          value={newGoal}
          onChange={(e) => setNewGoal(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addGoal()}
          className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5D38DE]"
          placeholder="Add a study goal..."
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

      {value.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-4">No study goals added yet. Add your first goal above.</p>
      )}
    </div>
  )
}
