"use client"

import { useState } from "react"
import { Plus, X, Code } from "lucide-react"

const SkillsSection = () => {
  const [skills, setSkills] = useState([
    { id: 1, name: "React.js", level: 90 },
    { id: 2, name: "Node.js", level: 85 },
    { id: 3, name: "TypeScript", level: 80 },
    { id: 4, name: "Python", level: 75 },
    { id: 5, name: "AWS", level: 70 },
  ])

  const [newSkill, setNewSkill] = useState({ name: "", level: 50 })

  const addSkill = () => {
    if (newSkill.name.trim()) {
      setSkills([...skills, { id: Date.now(), ...newSkill }])
      setNewSkill({ name: "", level: 50 })
    }
  }

  const removeSkill = (id) => {
    setSkills(skills.filter((skill) => skill.id !== id))
  }

  const updateSkillLevel = (id, level) => {
    setSkills(skills.map((skill) => (skill.id === id ? { ...skill, level } : skill)))
  }

  return (
    <div className="bg-[#1a1a1a] rounded-2xl p-4 sm:p-6 border border-[#2a2a2a]">
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#5D38DE]/20 rounded-lg flex items-center justify-center">
          <Code className="w-4 h-4 sm:w-5 sm:h-5 text-[#5D38DE]" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white">Skills & Expertise</h2>
      </div>

      {/* Add New Skill */}
      <div className="bg-[#242424] rounded-xl p-4 sm:p-5 border border-[#3a3a3a] mb-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={newSkill.name}
              onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
              className="w-full bg-[#1a1a1a] text-white rounded-lg p-3 border border-[#3a3a3a] focus:border-[#5D38DE] focus:outline-none text-sm sm:text-base"
              placeholder="Enter skill name (e.g., React.js)"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1 min-w-[200px]">
              <input
                type="range"
                min="0"
                max="100"
                value={newSkill.level}
                onChange={(e) => setNewSkill({ ...newSkill, level: Number.parseInt(e.target.value) })}
                className="w-full h-2 bg-[#1a1a1a] rounded-lg appearance-none cursor-pointer accent-[#5D38DE]"
              />
              <div className="text-center text-sm text-gray-400 mt-1">{newSkill.level}%</div>
            </div>
            <button
              onClick={addSkill}
              className="flex items-center gap-2 px-4 py-3 bg-[#5D38DE] text-white rounded-lg hover:bg-[#4d2ec4] transition-colors whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Skills List */}
      <div className="space-y-3">
        {skills.map((skill) => (
          <div key={skill.id} className="bg-[#242424] rounded-xl p-4 border border-[#3a3a3a] group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white font-medium">{skill.name}</span>
              <div className="flex items-center gap-3">
                <span className="text-[#5D38DE] font-semibold">{skill.level}%</span>
                <button
                  onClick={() => removeSkill(skill.id)}
                  className="p-1 bg-red-500/20 text-red-500 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/30"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-[#1a1a1a] rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#5D38DE] to-[#8b5cf6] h-full rounded-full transition-all duration-300"
                  style={{ width: `${skill.level}%` }}
                ></div>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={skill.level}
                onChange={(e) => updateSkillLevel(skill.id, Number.parseInt(e.target.value))}
                className="w-32 h-2 bg-[#1a1a1a] rounded-lg appearance-none cursor-pointer accent-[#5D38DE]"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SkillsSection
