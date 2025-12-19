export default function PreviousExperienceForm({ value, onChange }) {
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Previous Experience</label>
        <textarea
          value={value.previousExperience || ""}
          onChange={(e) => onChange({ ...value, previousExperience: e.target.value })}
          rows={4}
          className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5D38DE]"
          placeholder="Describe your previous academic or professional experience, internships, projects, or any relevant background..."
        />
        <p className="text-xs text-gray-500 mt-1">
          This helps mentors understand your background and tailor their guidance accordingly.
        </p>
      </div>
    </div>
  )
}
