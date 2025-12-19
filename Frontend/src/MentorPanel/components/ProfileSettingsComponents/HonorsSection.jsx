"use client"

import { useState } from "react"
import { Plus, Trash2, Award } from "lucide-react"

const HonorsSection = () => {
  const [honors, setHonors] = useState([
    {
      id: 1,
      title: "Best Developer Award",
      institution: "Tech Solutions Inc.",
      date: "2023",
      description: "Recognized for outstanding contribution to product development",
    },
  ])

  const updateHonor = (id, field, value) => {
    setHonors(honors.map(honor => 
      honor.id === id ? { ...honor, [field]: value } : honor
    ))
  }

  const addHonor = () => {
    setHonors([
      ...honors,
      {
        id: Date.now(),
        title: "",
        institution: "",
        date: "",
        description: "",
      },
    ])
  }

  const removeHonor = (id) => {
    setHonors(honors.filter((honor) => honor.id !== id))
  }

  return (
    <div className="bg-[#1a1a1a] rounded-2xl p-4 sm:p-6 border border-[#2a2a2a]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#5D38DE]/20 rounded-lg flex items-center justify-center">
            <Award className="w-4 h-4 sm:w-5 sm:h-5 text-[#5D38DE]" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">Honors & Awards</h2>
        </div>
        <button
          onClick={addHonor}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-[#5D38DE] text-white rounded-lg hover:bg-[#4d2ec4] transition-colors text-sm sm:text-base w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4" />
          Add Award
        </button>
      </div>

      <div className="space-y-4">
        {honors.map((honor) => (
          <div key={honor.id} className="bg-[#242424] rounded-xl p-4 sm:p-5 border border-[#3a3a3a] relative group">
            <button
              onClick={() => removeHonor(honor.id)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 sm:p-2 bg-red-500/20 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/30 z-10"
            >
              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pr-12 sm:pr-14">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Award Title</label>
                <input
                  type="text"
                  value={honor.title}
                  onChange={(e) => updateHonor(honor.id, 'title', e.target.value)}
                  className="w-full bg-[#1a1a1a] text-white rounded-lg p-3 border border-[#3a3a3a] focus:border-[#5D38DE] focus:outline-none text-sm sm:text-base"
                  placeholder="e.g., Best Developer Award"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Institution</label>
                <input
                  type="text"
                  value={honor.institution}
                  onChange={(e) => updateHonor(honor.id, 'institution', e.target.value)}
                  className="w-full bg-[#1a1a1a] text-white rounded-lg p-3 border border-[#3a3a3a] focus:border-[#5D38DE] focus:outline-none text-sm sm:text-base"
                  placeholder="Organization name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Date</label>
                <input
                  type="text"
                  value={honor.date}
                  onChange={(e) => updateHonor(honor.id, 'date', e.target.value)}
                  className="w-full bg-[#1a1a1a] text-white rounded-lg p-3 border border-[#3a3a3a] focus:border-[#5D38DE] focus:outline-none text-sm sm:text-base"
                  placeholder="YYYY"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                <textarea
                  value={honor.description}
                  onChange={(e) => updateHonor(honor.id, 'description', e.target.value)}
                  className="w-full bg-[#1a1a1a] text-white rounded-lg p-3 border border-[#3a3a3a] focus:border-[#5D38DE] focus:outline-none min-h-[80px] resize-none"
                  placeholder="What was this award for?"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HonorsSection
