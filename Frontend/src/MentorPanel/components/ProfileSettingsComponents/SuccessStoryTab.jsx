"use client"

import { useState, useEffect } from "react"
import { Trophy, Target, Lightbulb, Heart, Loader2 } from "lucide-react"
import { profileAPI } from "../../../utils/api"
import { useToast } from "../../../context/ToastContext"
import Toast from "../../components/Shared/Toast"

const SuccessStoryTab = () => {
  const { showError } = useToast()
  const [story, setStory] = useState({
    title: "",
    background: "",
    challenges: "",
    journey: "",
    currentStatus: "",
    keyLearnings: "",
    motivation: "",
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showToast, setShowToast] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const res = await profileAPI.mentor.get()
        if (res.data?.success) {
          const s = res.data.data.profile?.successStory || {}
          setStory({
            title: s.title || "",
            background: s.background || "",
            challenges: s.challenges || "",
            journey: s.journey || "",
            currentStatus: s.currentStatus || "",
            keyLearnings: s.keyLearnings || "",
            motivation: s.motivation || "",
          })
        }
      } catch (err) {
        console.error("Failed to load success story:", err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleSave = async () => {
    try {
      setSaving(true)
      const response = await profileAPI.mentor.update({
        successStory: {
          title: story.title,
          background: story.background,
          challenges: story.challenges,
          journey: story.journey,
          currentStatus: story.currentStatus,
          keyLearnings: story.keyLearnings,
          motivation: story.motivation,
          isPublished: true,
          createdAt: new Date()
        }
      })

      if (response.data?.success) {
        setShowToast(true)
        setTimeout(() => setShowToast(false), 3000)
      }
    } catch (err) {
      console.error("Failed to save success story:", err)
      showError("We couldn't save your success story. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-[#5D38DE] animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {showToast && (
        <Toast
          message="Success story saved successfully!"
          onClose={() => setShowToast(false)}
        />
      )}

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#5D38DE]/20 to-[#1a1a1a] rounded-2xl p-8 border border-[#5D38DE]/30">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-[#5D38DE] rounded-xl flex items-center justify-center">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">My Success Story</h2>
            <p className="text-gray-400">Share your journey to inspire others</p>
          </div>
        </div>
      </div>

      {/* Story Title */}
      <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#2a2a2a]">
        <label className="block text-sm font-medium text-gray-400 mb-3">Story Title</label>
        <input
          type="text"
          value={story.title}
          onChange={(e) => setStory({ ...story, title: e.target.value })}
          className="w-full bg-[#242424] text-white text-xl font-semibold rounded-xl p-4 border border-[#3a3a3a] focus:border-[#5D38DE] focus:outline-none"
          placeholder="Give your story a compelling title..."
        />
      </div>

      {/* Personal Background */}
      <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#2a2a2a]">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
            <Target className="w-5 h-5 text-blue-500" />
          </div>
          <h3 className="text-xl font-bold text-white">Personal Background</h3>
        </div>
        <textarea
          value={story.background}
          onChange={(e) => setStory({ ...story, background: e.target.value })}
          className="w-full bg-[#242424] text-white rounded-xl p-4 border border-[#3a3a3a] focus:border-[#5D38DE] focus:outline-none min-h-[120px] resize-none"
          placeholder="Where did you start? What was your initial situation?"
        />
      </div>

      {/* Challenges Faced */}
      <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#2a2a2a]">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
            <Target className="w-5 h-5 text-orange-500" />
          </div>
          <h3 className="text-xl font-bold text-white">Challenges Faced</h3>
        </div>
        <textarea
          value={story.challenges}
          onChange={(e) => setStory({ ...story, challenges: e.target.value })}
          className="w-full bg-[#242424] text-white rounded-xl p-4 border border-[#3a3a3a] focus:border-[#5D38DE] focus:outline-none min-h-[120px] resize-none"
          placeholder="What obstacles did you overcome?"
        />
      </div>

      {/* Journey Description */}
      <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#2a2a2a]">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-[#5D38DE]/20 rounded-lg flex items-center justify-center">
            <Trophy className="w-5 h-5 text-[#5D38DE]" />
          </div>
          <h3 className="text-xl font-bold text-white">The Journey</h3>
        </div>
        <textarea
          value={story.journey}
          onChange={(e) => setStory({ ...story, journey: e.target.value })}
          className="w-full bg-[#242424] text-white rounded-xl p-4 border border-[#3a3a3a] focus:border-[#5D38DE] focus:outline-none min-h-[150px] resize-none"
          placeholder="Describe your step-by-step journey to success..."
        />
      </div>

      {/* Current Status */}
      <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#2a2a2a]">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
            <Trophy className="w-5 h-5 text-green-500" />
          </div>
          <h3 className="text-xl font-bold text-white">Where I Am Now</h3>
        </div>
        <textarea
          value={story.currentStatus}
          onChange={(e) => setStory({ ...story, currentStatus: e.target.value })}
          className="w-full bg-[#242424] text-white rounded-xl p-4 border border-[#3a3a3a] focus:border-[#5D38DE] focus:outline-none min-h-[120px] resize-none"
          placeholder="What have you achieved? Where are you today?"
        />
      </div>

      {/* Key Learnings */}
      <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#2a2a2a]">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
          </div>
          <h3 className="text-xl font-bold text-white">Key Learnings</h3>
        </div>
        <textarea
          value={story.keyLearnings}
          onChange={(e) => setStory({ ...story, keyLearnings: e.target.value })}
          className="w-full bg-[#242424] text-white rounded-xl p-4 border border-[#3a3a3a] focus:border-[#5D38DE] focus:outline-none min-h-[120px] resize-none"
          placeholder="What important insights did you gain?"
        />
      </div>

      {/* Motivation for Mentoring */}
      <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#2a2a2a]">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-pink-500/20 rounded-lg flex items-center justify-center">
            <Heart className="w-5 h-5 text-pink-500" />
          </div>
          <h3 className="text-xl font-bold text-white">Why I Mentor</h3>
        </div>
        <textarea
          value={story.motivation}
          onChange={(e) => setStory({ ...story, motivation: e.target.value })}
          className="w-full bg-[#242424] text-white rounded-xl p-4 border border-[#3a3a3a] focus:border-[#5D38DE] focus:outline-none min-h-[120px] resize-none"
          placeholder="What motivates you to help others?"
        />
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-8 py-3 bg-[#5D38DE] text-white rounded-xl hover:bg-[#4d2ec4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          {saving ? "Saving..." : "Save Story"}
        </button>
      </div>
    </div>
  )
}

export default SuccessStoryTab
