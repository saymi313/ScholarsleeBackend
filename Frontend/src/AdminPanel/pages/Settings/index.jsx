"use client"

import React, { useState, useEffect } from "react"
import { adminSettingsAPI } from "../../../utils/api"
import { Loader2 } from "lucide-react"

export default function SettingsPage() {
  const [categories, setCategories] = useState([])
  const [featureFlags, setFeatureFlags] = useState({
    enableMentorVerification: true,
    enablePayouts: true,
    autoApproveFeedbacks: false,
    autoApproveServices: false
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [categoryInput, setCategoryInput] = useState("")
  const [categoryError, setCategoryError] = useState("")
  const [addingCategory, setAddingCategory] = useState(false)
  const [removingCategory, setRemovingCategory] = useState(null)

  // Fetch settings on mount
  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      setError("")
      const response = await adminSettingsAPI.getSettings()
      if (response.data?.success) {
        const settings = response.data.data.settings
        setCategories(settings.categories || [])
        setFeatureFlags({
          enableMentorVerification: settings.featureFlags?.enableMentorVerification ?? true,
          enablePayouts: settings.featureFlags?.enablePayouts ?? true,
          autoApproveFeedbacks: settings.featureFlags?.autoApproveFeedbacks ?? false,
          autoApproveServices: settings.featureFlags?.autoApproveServices ?? false
        })
      } else {
        setError(response.data?.message || "We couldn't load settings. Please refresh the page.")
      }
    } catch (err) {
      console.error("Error fetching settings:", err)
      setError(err.response?.data?.message || err.message || "We couldn't load settings. Please refresh the page.")
    } finally {
      setLoading(false)
    }
  }

  const handleFlagChange = (flagName, value) => {
    setFeatureFlags(prev => ({
      ...prev,
      [flagName]: value
    }))
  }

  const handleApplyChanges = async () => {
    try {
      setSaving(true)
      setError("")
      setSuccess("")

      const response = await adminSettingsAPI.updateSettings({
        featureFlags: featureFlags
      })

      if (response.data?.success) {
        setSuccess("Settings updated successfully")
        // Update local state with response data
        const updatedSettings = response.data.data.settings
        setFeatureFlags({
          enableMentorVerification: updatedSettings.featureFlags?.enableMentorVerification ?? true,
          enablePayouts: updatedSettings.featureFlags?.enablePayouts ?? true,
          autoApproveFeedbacks: updatedSettings.featureFlags?.autoApproveFeedbacks ?? false,
          autoApproveServices: updatedSettings.featureFlags?.autoApproveServices ?? false
        })
        setTimeout(() => setSuccess(""), 5000)
      } else {
        setError(response.data?.message || "We couldn't save your settings. Please try again.")
      }
    } catch (err) {
      console.error("Error updating settings:", err)
      setError(err.response?.data?.message || err.message || "We couldn't save your settings. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const handleAddCategory = async (e) => {
    e.preventDefault()
    setCategoryError("")

    const name = categoryInput.trim()

    if (!name) {
      setCategoryError("Category is required.")
      return
    }

    const valid = /^[A-Za-z0-9 &-]{2,50}$/.test(name)
    if (!valid) {
      setCategoryError("2-50 chars; letters, numbers, spaces, & or -.")
      return
    }

    const exists = categories.some((c) => c.toLowerCase() === name.toLowerCase())
    if (exists) {
      setCategoryError("Category already exists.")
      return
    }

    try {
      setAddingCategory(true)
      setCategoryError("")

      const response = await adminSettingsAPI.addCategory(name)

      if (response.data?.success) {
        const updatedSettings = response.data.data.settings
        setCategories(updatedSettings.categories || [])
        setCategoryInput("")
        setSuccess("Category added successfully")
        setTimeout(() => setSuccess(""), 3000)
      } else {
        setCategoryError(response.data?.message || "We couldn't add this category. Please try again.")
      }
    } catch (err) {
      console.error("Error adding category:", err)
      setCategoryError(err.response?.data?.message || err.message || "We couldn't add this category. Please try again.")
    } finally {
      setAddingCategory(false)
    }
  }

  const handleRemoveCategory = async (category) => {
    try {
      setRemovingCategory(category)

      const response = await adminSettingsAPI.removeCategory(category)

      if (response.data?.success) {
        const updatedSettings = response.data.data.settings
        setCategories(updatedSettings.categories || [])
        setSuccess("Category removed successfully")
        setTimeout(() => setSuccess(""), 3000)
      } else {
        setError(response.data?.message || "We couldn't remove this category. Please try again.")
      }
    } catch (err) {
      console.error("Error removing category:", err)
      setError(err.response?.data?.message || err.message || "We couldn't remove this category. Please try again.")
    } finally {
      setRemovingCategory(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-[#5D38DE]" />
      </div>
    )
  }

  return (
    <section className="px-4 md:px-8 pb-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="rounded-xl border border-white/10 bg-[#161619] p-4">
        <h3 className="text-lg font-semibold mb-3">Categories</h3>
        <form
          onSubmit={handleAddCategory}
          className="flex gap-2 mb-4"
        >
          <input
            name="category"
            value={categoryInput}
            onChange={(e) => setCategoryInput(e.target.value)}
            maxLength={50}
            aria-invalid={!!categoryError}
            className="bg-[#121214] border border-white/10 rounded px-3 py-2 text-sm flex-1"
            placeholder="Add category"
          />
          <button
            type="submit"
            disabled={addingCategory}
            className="rounded-md bg-[#5D38DE] px-3 py-2 text-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {addingCategory && <Loader2 className="w-4 h-4 animate-spin" />}
            Add
          </button>
        </form>
        {categoryError && <p className="mb-2 text-xs text-rose-300">{categoryError}</p>}
        <ul className="space-y-2 text-sm">
          {categories.length > 0 ? (
            categories.map((c) => (
              <li key={c} className="flex items-center justify-between bg-white/5 rounded px-3 py-2">
                {c}
                <button
                  onClick={() => handleRemoveCategory(c)}
                  disabled={removingCategory === c}
                  className="text-rose-300 text-xs hover:text-rose-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  {removingCategory === c ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Removing...
                    </>
                  ) : (
                    "Remove"
                  )}
                </button>
              </li>
            ))
          ) : (
            <li className="text-sm text-white/50 py-2">No categories available</li>
          )}
        </ul>
      </div>
      <div className="rounded-xl border border-white/10 bg-[#161619] p-4">
        <h3 className="text-lg font-semibold mb-3">Feature Flags</h3>
        <div className="space-y-3">
          <label className="flex items-center justify-between bg-white/5 rounded px-3 py-2">
            <span className="text-sm">Enable Mentor Verification</span>
            <input
              type="checkbox"
              checked={featureFlags.enableMentorVerification}
              onChange={(e) => handleFlagChange('enableMentorVerification', e.target.checked)}
              className="accent-[#5D38DE]"
            />
          </label>
          <label className="flex items-center justify-between bg-white/5 rounded px-3 py-2">
            <span className="text-sm">Enable Payouts</span>
            <input
              type="checkbox"
              checked={featureFlags.enablePayouts}
              onChange={(e) => handleFlagChange('enablePayouts', e.target.checked)}
              className="accent-[#5D38DE]"
            />
          </label>
          <label className="flex items-center justify-between bg-white/5 rounded px-3 py-2">
            <span className="text-sm">Auto-approve Feedbacks</span>
            <input
              type="checkbox"
              checked={featureFlags.autoApproveFeedbacks}
              onChange={(e) => handleFlagChange('autoApproveFeedbacks', e.target.checked)}
              className="accent-[#5D38DE]"
            />
          </label>
          <label className="flex items-center justify-between bg-white/5 rounded px-3 py-2">
            <span className="text-sm">Auto-approve Services</span>
            <input
              type="checkbox"
              checked={featureFlags.autoApproveServices}
              onChange={(e) => handleFlagChange('autoApproveServices', e.target.checked)}
              className="accent-[#5D38DE]"
            />
          </label>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={handleApplyChanges}
            disabled={saving}
            className="rounded-md bg-[#5D38DE] px-4 py-2 text-sm font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            Apply Changes
          </button>
        </div>
        {error && <p className="mt-2 text-xs text-rose-300">{error}</p>}
        {success && <p className="mt-2 text-xs text-emerald-300">{success}</p>}
      </div>
    </section>
  )
}
