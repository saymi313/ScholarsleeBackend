"use client"

export default function RoleCheckbox({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer group">
      <div className="relative">
        <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" />
        <div className="w-5 h-5 border-2 border-gray-600 rounded bg-[#0a0a0a] peer-checked:bg-[#5D38DE] peer-checked:border-[#5D38DE] transition-all duration-200 flex items-center justify-center">
          {checked && (
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>
      <span className="text-white text-sm font-['Poppins'] group-hover:text-[#5D38DE] transition-colors">{label}</span>
    </label>
  )
}
