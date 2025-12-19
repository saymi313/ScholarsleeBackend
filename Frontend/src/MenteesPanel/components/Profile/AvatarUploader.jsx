import React, { useRef, useState } from "react"
import axios from 'axios'

export default function AvatarUploader({ value, onChange }) {
  const fileRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(null)

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Show preview
    const reader = new FileReader()
    reader.onload = () => setPreview(reader.result)
    reader.readAsDataURL(file)

    // Upload to server
    setUploading(true)
    const formData = new FormData()
    formData.append('avatar', file)

    try {
      const token = localStorage.getItem('token')
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/upload/profile`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        }
      )

      if (response.data.success) {
        // Update with server URL
        onChange?.(response.data.fileUrl)
        setPreview(null)
      } else {
        alert('Upload failed: ' + response.data.message)
        setPreview(null)
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload image: ' + (error.response?.data?.message || error.message))
      setPreview(null)
    } finally {
      setUploading(false)
    }
  }

  const displayImage = preview || (value && value.startsWith('/uploads')
    ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${value}`
    : value) || "/u.jpeg"

  return (
    <div className="flex items-center gap-4">
      <div className="relative">
        <img
          src={displayImage}
          alt="avatar"
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border"
        />
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        )}
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <button
          onClick={() => fileRef.current?.click()}
          className="px-4 py-2 rounded-lg bg-[#5D38DE] text-white text-sm hover:bg-[#6d48ee] disabled:opacity-50"
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
        <button
          onClick={() => onChange?.("")}
          className="px-4 py-2 rounded-lg bg-gray-100 text-sm hover:bg-gray-200"
          disabled={uploading}
        >
          Remove
        </button>
      </div>
      <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
    </div>
  )
}
