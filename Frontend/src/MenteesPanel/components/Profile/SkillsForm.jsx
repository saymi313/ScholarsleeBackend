import React, { useState } from "react"

export default function SkillsForm({ value = [], onChange }) {
  const [input, setInput] = useState("")
  const add = () => {
    const v = input.trim()
    if (!v) return
    const next = Array.from(new Set([...(value || []), v]))
    onChange?.(next)
    setInput("")
  }
  const remove = (skill) => onChange?.((value || []).filter((s) => s !== skill))
  return (
    <div>
      <div className="flex gap-2 mb-2">
        <input value={input} onChange={(e)=> setInput(e.target.value)} onKeyDown={(e)=> e.key==='Enter' && (e.preventDefault(), add())} placeholder="Add a skill and press Enter" className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5D38DE]" />
        <button onClick={add} className="px-3 py-2 rounded-lg bg-[#5D38DE] text-white text-sm">Add</button>
      </div>
      <div className="flex flex-wrap gap-2">
        {(value || []).map((s) => (
          <span key={s} className="px-2 py-1 rounded-full bg-gray-100 text-xs text-gray-700 border inline-flex items-center gap-2">
            {s}
            <button onClick={()=> remove(s)} className="text-gray-400 hover:text-gray-600">×</button>
          </span>
        ))}
      </div>
    </div>
  )
}


