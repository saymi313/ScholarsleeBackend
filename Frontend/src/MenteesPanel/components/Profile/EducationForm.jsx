import React from "react"

export default function EducationForm({ value = [], onChange }) {
  const addItem = () => {
    onChange?.([...(value || []), { school: "", degree: "", year: "" }])
  }
  const update = (idx, patch) => {
    const next = value.map((v, i) => (i === idx ? { ...v, ...patch } : v))
    onChange?.(next)
  }
  const remove = (idx) => {
    onChange?.(value.filter((_, i) => i !== idx))
  }
  return (
    <div className="space-y-3">
      {(value || []).map((edu, idx) => (
        <div key={idx} className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-end">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">School</label>
            <input value={edu.school} onChange={(e)=> update(idx,{ school: e.target.value })} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5D38DE]" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
            <input value={edu.degree} onChange={(e)=> update(idx,{ degree: e.target.value })} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5D38DE]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
            <input value={edu.year} onChange={(e)=> update(idx,{ year: e.target.value })} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5D38DE]" />
          </div>
          <div className="sm:col-span-5 flex justify-end">
            <button onClick={()=> remove(idx)} className="text-red-600 text-sm px-3 py-2 hover:bg-red-50 rounded-lg">Remove</button>
          </div>
        </div>
      ))}
      <button onClick={addItem} className="px-4 py-2 rounded-lg bg-gray-100 text-sm hover:bg-gray-200">Add education</button>
    </div>
  )
}


