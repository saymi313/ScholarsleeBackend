import { useEffect, useState, useRef } from "react"
import { Edit2, X, Check, GraduationCap, Briefcase, Award, Code } from "lucide-react"
import { mentorProfileAPI } from "../../../utils/api"
import EducationSection from "./EducationSection"
import ExperienceSection from "./ExperienceSection"
import SkillsSection from "./SkillsSection"
import HonorsSection from "./HonorsSection"

const BackgroundTab = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState(null)
  const [background, setBackground] = useState("")
  const [originalBackground, setOriginalBackground] = useState("")
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  // Refs to get data from child components
  const educationRef = useRef(null)
  const experienceRef = useRef(null)
  const skillsRef = useRef(null)
  const honorsRef = useRef(null)

  const MIN_LENGTH = 50
  const MAX_LENGTH = 5000

  const validateBackground = (value) => {
    if (!value || value.trim().length === 0) {
      setError("")
      return true
    }
    if (value.length < MIN_LENGTH) {
      setError(`Minimum ${MIN_LENGTH} characters required`)
      return false
    }
    if (value.length > MAX_LENGTH) {
      setError(`Maximum ${MAX_LENGTH} characters allowed`)
      return false
    }
    setError("")
    return true
  }

  const handleChange = (e) => {
    const value = e.target.value
    setBackground(value)
    validateBackground(value)
  }

  useEffect(() => {
    loadProfileData()
  }, [])

  const loadProfileData = async () => {
    setLoading(true)
    try {
      const res = await mentorProfileAPI.get()
      if (res.data?.success) {
        const profile = res.data.data.profile
        setProfileData(profile)
        const bg = profile?.background || ""
        setBackground(bg)
        setOriginalBackground(bg)
        validateBackground(bg)
      }
    } catch (error) {
      console.error("Failed to load profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
    setMessage("")
  }

  const handleSaveAll = async () => {
    if (!validateBackground(background)) {
      setMessage("✗ Please fix validation errors in Professional Summary")
      setTimeout(() => setMessage(""), 3000)
      return
    }

    setSaving(true)
    setMessage("")
    try {
      // Collect data from all child components using their exposed getData methods
      const updateData = { background }

      // Get education data if ref exists
      if (educationRef.current?.getData) {
        const educationData = educationRef.current.getData()
        updateData.education = educationData.map(edu => ({
          degree: edu.degree,
          institution: edu.institution,
          year: edu.year,
          field: edu.field,
          gpa: edu.gpa
        }))
      }

      // Get experience data if ref exists
      if (experienceRef.current?.getData) {
        const experienceData = experienceRef.current.getData()
        // Transform to backend format
        updateData.experience = experienceData.map(exp => ({
          position: exp.title,
          company: exp.company,
          startDate: exp.startDate || null,
          endDate: exp.endDate === 'Present' || !exp.endDate ? null : exp.endDate,
          isCurrent: exp.endDate === 'Present',
          description: exp.description || ""
        }))
      }

      // Get honors/achievements data if ref exists
      if (honorsRef.current?.getData) {
        const honorsData = honorsRef.current.getData()
        updateData.achievements = honorsData.map(honor => JSON.stringify({
          title: honor.title,
          institution: honor.institution,
          date: honor.date,
          description: honor.description
        }))
      }

      // Get skills data if ref exists
      if (skillsRef.current?.getData) {
        const skillsData = skillsRef.current.getData()
        updateData.specializations = skillsData.map(s => s.name)
      }

      console.log('Saving profile data:', updateData)

      // Save all data at once
      await mentorProfileAPI.update(updateData)

      await loadProfileData() // Reload data
      setOriginalBackground(background)
      setIsEditing(false)
      setMessage("✓ Profile saved successfully")
      setTimeout(() => setMessage(""), 3000)
    } catch (error) {
      setMessage("✗ Failed to save profile")
      console.error("Save error:", error)
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setBackground(originalBackground)
    validateBackground(originalBackground)
    setIsEditing(false)
    setMessage("")
    setError("")
    // Reload to reset child components
    loadProfileData()
  }

  const charCount = background.length
  const isValid = charCount === 0 || (charCount >= MIN_LENGTH && charCount <= MAX_LENGTH)
  const showSuccess = charCount >= MIN_LENGTH && charCount <= MAX_LENGTH

  // VIEW MODE - All in one box
  if (!isEditing) {
    return (
      <div className="space-y-6">
        {/* Edit Button */}
        <div className="flex justify-end">
          <button
            onClick={handleEdit}
            className="flex items-center gap-2 px-6 py-3 bg-[#5D38DE] text-white rounded-lg hover:bg-[#4d2ec4] transition-colors font-medium"
          >
            <Edit2 className="w-4 h-4" />
            Edit Profile
          </button>
        </div>

        {message && (
          <div className={`bg-[#1a1a1a] rounded-2xl p-4 border ${message.startsWith("✓") ? "border-green-500" : "border-red-500"}`}>
            <p className={`text-sm text-center ${message.startsWith("✓") ? "text-green-500" : "text-red-500"}`}>
              {message}
            </p>
          </div>
        )}

        {/* ALL BACKGROUND INFO IN ONE BOX */}
        <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#2a2a2a] space-y-8">
          {/* Professional Summary */}
          <div>
            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              Professional Summary
            </h3>
            {background ? (
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{background}</p>
            ) : (
              <p className="text-gray-500 italic">No professional summary added yet.</p>
            )}
          </div>

          <hr className="border-[#3a3a3a]" />

          {/* Education */}
          <div>
            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-[#5D38DE]" />
              Education
            </h3>
            {profileData?.education && profileData.education.length > 0 ? (
              <div className="space-y-4">
                {profileData.education.map((edu, index) => (
                  <div key={index} className="border-l-2 border-[#5D38DE] pl-4">
                    <p className="text-white font-semibold">{edu.degree}</p>
                    <p className="text-gray-400">{edu.institution}</p>
                    <div className="flex gap-4 text-sm text-gray-500 mt-1">
                      {edu.field && <span>{edu.field}</span>}
                      {edu.year && <span>• {edu.year}</span>}
                      {edu.gpa && <span>• GPA: {edu.gpa}</span>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No education added yet.</p>
            )}
          </div>

          <hr className="border-[#3a3a3a]" />

          {/* Experience */}
          <div>
            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-[#5D38DE]" />
              Experience
            </h3>
            {profileData?.experience && profileData.experience.length > 0 ? (
              <div className="space-y-4">
                {profileData.experience.map((exp, index) => (
                  <div key={index} className="border-l-2 border-[#5D38DE] pl-4">
                    <p className="text-white font-semibold">{exp.position}</p>
                    <p className="text-gray-400">{exp.company}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {exp.startDate ? new Date(exp.startDate).getFullYear() : ''} - {exp.isCurrent ? 'Present' : (exp.endDate ? new Date(exp.endDate).getFullYear() : '')}
                    </p>
                    {exp.description && <p className="text-gray-300 mt-2 text-sm">{exp.description}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No experience added yet.</p>
            )}
          </div>

          <hr className="border-[#3a3a3a]" />

          {/* Skills */}
          <div>
            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <Code className="w-5 h-5 text-[#5D38DE]" />
              Skills & Expertise
            </h3>
            {profileData?.specializations && profileData.specializations.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profileData.specializations.map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-[#5D38DE]/20 text-[#5D38DE] rounded-full text-sm border border-[#5D38DE]/30">
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No skills added yet.</p>
            )}
          </div>

          <hr className="border-[#3a3a3a]" />

          {/* Honors & Awards */}
          <div>
            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <Award className="w-5 h-5 text-[#5D38DE]" />
              Honors & Awards
            </h3>
            {profileData?.achievements && profileData.achievements.length > 0 ? (
              <div className="space-y-4">
                {profileData.achievements.map((achievement, index) => {
                  try {
                    const honor = JSON.parse(achievement)
                    return (
                      <div key={index} className="border-l-2 border-[#5D38DE] pl-4">
                        <p className="text-white font-semibold">{honor.title}</p>
                        {honor.institution && <p className="text-gray-400">{honor.institution}</p>}
                        {honor.date && <p className="text-sm text-gray-500 mt-1">{honor.date}</p>}
                        {honor.description && <p className="text-gray-300 mt-2 text-sm">{honor.description}</p>}
                      </div>
                    )
                  } catch {
                    return (
                      <div key={index} className="border-l-2 border-[#5D38DE] pl-4">
                        <p className="text-white font-semibold">{achievement}</p>
                      </div>
                    )
                  }
                })}
              </div>
            ) : (
              <p className="text-gray-500 italic">No honors or awards added yet.</p>
            )}
          </div>
        </div>
      </div>
    )
  }

  // EDIT MODE - Separate sections
  return (
    <div className="space-y-6">
      {/* Professional Summary */}
      <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#2a2a2a]">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-white">Professional Summary</h2>
          <p className="text-gray-400 text-sm mt-1">Tell mentees about your background and expertise</p>
        </div>
        <textarea
          className={`w-full bg-[#242424] text-white rounded-xl p-4 border focus:outline-none min-h-[150px] resize-none transition-colors ${error
            ? 'border-red-500 focus:border-red-500'
            : showSuccess
              ? 'border-green-500 focus:border-green-500'
              : 'border-[#3a3a3a] focus:border-[#5D38DE]'
            }`}
          placeholder="Write a compelling summary of your experience, expertise, and mentoring approach..."
          value={background}
          onChange={handleChange}
          disabled={loading}
        />
        <div className="flex justify-between items-center mt-2">
          <div>
            {error ? (
              <p className="text-red-400 text-xs">{error}</p>
            ) : charCount > 0 && charCount < MIN_LENGTH ? (
              <p className="text-yellow-400 text-xs">{MIN_LENGTH - charCount} more characters needed</p>
            ) : charCount >= MIN_LENGTH ? (
              <p className="text-green-400 text-xs">✓ Looks good!</p>
            ) : (
              <p className="text-gray-500 text-xs">Minimum {MIN_LENGTH} characters recommended</p>
            )}
          </div>
          <p className={`text-xs ${charCount > MAX_LENGTH ? 'text-red-400' : charCount > MAX_LENGTH * 0.9 ? 'text-yellow-400' : 'text-gray-500'
            }`}>
            {charCount} / {MAX_LENGTH}
          </p>
        </div>
      </div>

      <EducationSection ref={educationRef} />
      <ExperienceSection ref={experienceRef} />
      <SkillsSection ref={skillsRef} />
      <HonorsSection ref={honorsRef} />

      {/* Save and Cancel Buttons */}
      <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#2a2a2a] sticky bottom-0 z-10">
        {message && (
          <p className={`text-sm mb-4 text-center ${message.startsWith("✓") ? "text-green-500" : "text-red-500"}`}>
            {message}
          </p>
        )}
        <div className="flex gap-4 justify-end">
          <button
            onClick={handleCancel}
            disabled={saving}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${saving
              ? "bg-gray-700 text-gray-500 cursor-not-allowed"
              : "bg-[#2a2a2a] text-white hover:bg-[#3a3a3a] border border-[#3a3a3a]"
              }`}
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
          <button
            onClick={handleSaveAll}
            disabled={saving || loading || !isValid}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg text-white font-medium ${saving || loading || !isValid
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-[#5D38DE] hover:bg-[#4d2ec4]"
              }`}
          >
            <Check className="w-4 h-4" />
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default BackgroundTab
