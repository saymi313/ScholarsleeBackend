import { useEffect, useState } from "react"
import { mentorProfileAPI } from "../../../utils/api"
import EducationSection from "./EducationSection"
import ExperienceSection from "./ExperienceSection"
import SkillsSection from "./SkillsSection"
import HonorsSection from "./HonorsSection"

const BackgroundTab = () => {
  const [background, setBackground] = useState("")
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const res = await mentorProfileAPI.get()
        if (res.data?.success) {
          setBackground(res.data.data.profile?.background || "")
        }
      } catch (error) {
        console.error("Failed to load profile:", error)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setMessage("")
    try {
      const res = await mentorProfileAPI.update({ background })
      if (res.data?.success) {
        setMessage("✓ Saved successfully")
        setTimeout(() => setMessage(""), 3000)
      }
    } catch (error) {
      setMessage("✗ Failed to save")
      console.error("Save error:", error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Professional Summary */}
      <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#2a2a2a]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">Professional Summary</h2>
          <button
            onClick={handleSave}
            disabled={saving || loading}
            className={`px-4 py-2 rounded-lg text-white font-medium ${saving || loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-[#5D38DE] hover:bg-[#4d2ec4]"
              }`}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
        {message && (
          <p className={`text-sm mb-2 ${message.startsWith("✓") ? "text-green-500" : "text-red-500"}`}>
            {message}
          </p>
        )}
        <textarea
          className="w-full bg-[#242424] text-white rounded-xl p-4 border border-[#3a3a3a] focus:border-[#5D38DE] focus:outline-none min-h-[150px] resize-none"
          placeholder="Write a compelling summary of your experience, expertise, and mentoring approach..."
          value={background}
          onChange={(e) => setBackground(e.target.value)}
          disabled={loading}
        />
      </div>

      <EducationSection />
      <ExperienceSection />
      <SkillsSection />
      <HonorsSection />
    </div>
  )
}

export default BackgroundTab
