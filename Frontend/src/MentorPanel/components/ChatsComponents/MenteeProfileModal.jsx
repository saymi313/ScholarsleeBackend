"use client"

import React, { useState, useEffect } from 'react'
import { X, Mail, Linkedin, MapPin, GraduationCap, Target, BookOpen, Briefcase, Clock, DollarSign, Globe } from 'lucide-react'
import { profileAPI } from '../../../utils/api'

export default function MenteeProfileModal({ menteeId, onClose }) {
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchMenteeProfile = async () => {
            try {
                setLoading(true)
                setError(null)

                const response = await profileAPI.mentee.getById(menteeId)

                if (response.data && response.data.success) {
                    const profileData = response.data.data.profile
                    setProfile(profileData)
                } else {
                    setError('Failed to load profile')
                }
            } catch (err) {
                console.error('Error fetching mentee profile:', err)
                setError('Failed to load profile')
            } finally {
                setLoading(false)
            }
        }

        if (menteeId) {
            fetchMenteeProfile()
        }
    }, [menteeId])

    if (!menteeId) return null

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70 backdrop-blur-xl"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-5xl max-h-[92vh] overflow-hidden bg-[#0a0a0a] rounded-2xl border border-white/5"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 z-20 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all group"
                >
                    <X className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                </button>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32">
                        <div className="w-12 h-12 border-2 border-white/10 border-t-[#5D38DE] rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-500 text-sm">Loading profile</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-32">
                        <p className="text-gray-400">{error}</p>
                    </div>
                ) : profile ? (
                    <div className="h-full max-h-[92vh] overflow-y-auto custom-scrollbar">
                        {/* Header */}
                        <div className="px-10 pt-10 pb-8">
                            <div className="flex items-start gap-8">
                                <div className="flex-shrink-0">
                                    {profile.userId?.profile?.avatar ? (
                                        <img
                                            src={profile.userId.profile.avatar}
                                            alt={profile.userId?.profile?.firstName || 'Mentee'}
                                            className="w-28 h-28 rounded-full object-cover ring-2 ring-white/10"
                                        />
                                    ) : (
                                        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#5D38DE] to-[#7c5ce6] flex items-center justify-center ring-2 ring-white/10">
                                            <span className="text-4xl font-medium text-white">
                                                {profile.userId?.profile?.firstName?.[0] || 'M'}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0 pt-2">
                                    <h1 className="text-3xl font-semibold text-white mb-3">
                                        {profile.userId?.profile?.firstName || ''} {profile.userId?.profile?.lastName || ''}
                                    </h1>

                                    <div className="flex flex-wrap items-center gap-3 mb-6">
                                        {profile.educationLevel && (
                                            <div className="flex items-center gap-2 text-gray-400">
                                                <GraduationCap className="w-4 h-4" />
                                                <span className="text-sm">{profile.educationLevel}</span>
                                            </div>
                                        )}

                                        {profile.userId?.profile?.country && (
                                            <div className="h-4 w-px bg-white/10" />
                                        )}

                                        {profile.userId?.profile?.country && (
                                            <div className="flex items-center gap-2 text-gray-400">
                                                <MapPin className="w-4 h-4" />
                                                <span className="text-sm">{profile.userId.profile.country}</span>
                                            </div>
                                        )}

                                        {profile.timeline && (
                                            <>
                                                <div className="h-4 w-px bg-white/10" />
                                                <div className="flex items-center gap-2 text-gray-400">
                                                    <Clock className="w-4 h-4" />
                                                    <span className="text-sm">{profile.timeline}</span>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                </div>
                            </div>
                        </div>

                        {/* Separator */}
                        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mx-10 mb-8" />

                        {/* Content */}
                        <div className="px-10 pb-10">
                            {/* Notice */}
                            {!profile.educationLevel && !profile.studyGoals?.length && !profile.academicInterests?.length && (
                                <div className="mb-8 p-4 bg-white/5 rounded-lg border border-white/10">
                                    <p className="text-sm text-gray-400">Profile still in progress — Reach out to connect</p>
                                </div>
                            )}

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                                {/* Main Content */}
                                <div className="lg:col-span-2 space-y-10">
                                    {/* Study Goals */}
                                    {profile.studyGoals && profile.studyGoals.length > 0 && (
                                        <div>
                                            <div className="flex items-center gap-3 mb-4">
                                                <Target className="w-5 h-5 text-[#5D38DE]" />
                                                <h2 className="text-lg font-medium text-white">Study Goals</h2>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {profile.studyGoals.map((goal, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg text-sm transition-colors"
                                                    >
                                                        {goal}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Academic Interests */}
                                    {profile.academicInterests && profile.academicInterests.length > 0 && (
                                        <div>
                                            <div className="flex items-center gap-3 mb-4">
                                                <BookOpen className="w-5 h-5 text-[#5D38DE]" />
                                                <h2 className="text-lg font-medium text-white">Academic Interests</h2>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {profile.academicInterests.map((interest, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg text-sm transition-colors"
                                                    >
                                                        {interest}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Career Goals */}
                                    {profile.careerGoals && profile.careerGoals.length > 0 && (
                                        <div>
                                            <div className="flex items-center gap-3 mb-4">
                                                <Briefcase className="w-5 h-5 text-[#5D38DE]" />
                                                <h2 className="text-lg font-medium text-white">Career Goals</h2>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {profile.careerGoals.map((goal, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg text-sm transition-colors"
                                                    >
                                                        {goal}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Previous Experience */}
                                    {profile.previousExperience && (
                                        <div>
                                            <h2 className="text-lg font-medium text-white mb-3">Previous Experience</h2>
                                            <p className="text-gray-400 leading-relaxed whitespace-pre-wrap">{profile.previousExperience}</p>
                                        </div>
                                    )}

                                    {/* Challenges */}
                                    {profile.challenges && profile.challenges.length > 0 && (
                                        <div>
                                            <h2 className="text-lg font-medium text-white mb-4">Current Challenges</h2>
                                            <ul className="space-y-3">
                                                {profile.challenges.map((challenge, index) => (
                                                    <li key={index} className="flex gap-3 text-gray-400">
                                                        <span className="text-[#5D38DE] mt-1.5 w-1 h-1 rounded-full bg-[#5D38DE] flex-shrink-0" />
                                                        <span className="flex-1">{challenge}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                {/* Sidebar */}
                                <div className="space-y-8">
                                    {/* Target Countries */}
                                    {profile.targetCountries && profile.targetCountries.length > 0 && (
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-400 mb-3">Target Countries</h3>
                                            <div className="space-y-2">
                                                {profile.targetCountries.map((country, index) => (
                                                    <div key={index} className="text-gray-300">{country}</div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Institution */}
                                    {profile.currentInstitution && (
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-400 mb-2">Current Institution</h3>
                                            <p className="text-gray-300">{profile.currentInstitution}</p>
                                        </div>
                                    )}

                                    {/* Budget */}
                                    {profile.budget && profile.budget > 0 && (
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-400 mb-2">Budget</h3>
                                            <p className="text-2xl font-semibold text-white">
                                                {profile.budgetCurrency || 'USD'} {profile.budget.toLocaleString()}
                                            </p>
                                        </div>
                                    )}

                                    {/* Contact */}
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-400 mb-3">Contact Information</h3>
                                        <div className="space-y-3">
                                            {profile.userId?.email && (
                                                <a
                                                    href={`mailto:${profile.userId.email}`}
                                                    className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors group"
                                                >
                                                    <Mail className="w-4 h-4 text-gray-500 group-hover:text-[#5D38DE] transition-colors" />
                                                    <span className="truncate">{profile.userId.email}</span>
                                                </a>
                                            )}

                                            {profile.userId?.profile?.phone && (
                                                <div className="flex items-center gap-2 text-sm text-gray-300">
                                                    <div className="w-4 h-4 flex items-center justify-center text-gray-500">+</div>
                                                    <span className="truncate">{profile.userId.profile.phone}</span>
                                                </div>
                                            )}

                                            {profile.socialLinks?.website && (
                                                <a
                                                    href={profile.socialLinks.website}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors group"
                                                >
                                                    <Globe className="w-4 h-4 text-gray-500 group-hover:text-[#5D38DE] transition-colors" />
                                                    <span className="truncate">Website</span>
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>

            <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
        </div>
    )
}
