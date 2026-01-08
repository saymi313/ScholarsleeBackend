"use client"

import ReactCountryFlag from "react-country-flag"
import { X, GraduationCap, Trophy, Calendar } from "lucide-react"

export default function SuccessStoryModal({ story, onClose }) {
    if (!story) return null

    return (
        <div
            className="absolute inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 animate-fade-in"
            style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

            {/* Modal Card */}
            <div className="relative w-full max-w-3xl bg-white rounded-xl shadow-2xl overflow-hidden transform transition-all animate-scale-in flex flex-col sm:flex-row max-h-[85vh]">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 z-10 p-1.5 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-full transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>

                {/* Image Section (Left Side) */}
                <div className="relative h-48 sm:h-auto sm:w-5/12 shrink-0">
                    <img
                        src={story.image || "/placeholder.svg"}
                        className="w-full h-full object-cover object-top"
                        alt={story.name}
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-90 sm:hidden" />
                    <div className="absolute inset-0 bg-black/20 hidden sm:block" />

                    <div className="absolute top-4 left-4 z-10">
                        <div className="bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                            <ReactCountryFlag
                                countryCode={story.countryCode}
                                svg
                                style={{ width: "1em", height: "1em", borderRadius: "50%" }}
                            />
                            <span className="text-[10px] font-bold uppercase tracking-wide text-stone-800">{story.country}</span>
                        </div>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 text-white sm:hidden">
                        <h2 className="text-xl font-serif font-medium tracking-tight mb-1">{story.name}</h2>
                        <div className="flex items-center gap-1.5 opacity-90">
                            <GraduationCap className="w-3.5 h-3.5" />
                            <span className="text-xs font-medium tracking-wide">{story.university}</span>
                        </div>
                    </div>
                </div>

                {/* Content Section (Right Side) */}
                <div className="flex-1 flex flex-col bg-white overflow-hidden sm:w-7/12">
                    <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6">
                        {/* Desktop Title Header */}
                        <div className="hidden sm:block border-b border-stone-100 pb-4">
                            <h2 className="text-2xl font-serif font-medium text-stone-900 mb-1">{story.name}</h2>
                            <div className="flex items-center gap-1.5 text-stone-600">
                                <GraduationCap className="w-4 h-4 text-stone-400" />
                                <span className="text-xs font-semibold tracking-wide uppercase">{story.university}</span>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <div className="flex items-center gap-1.5 text-stone-400">
                                    <Trophy className="w-3 h-3" />
                                    <span className="text-[9px] font-bold uppercase tracking-wider">Achievement</span>
                                </div>
                                <p className="text-sm font-semibold text-stone-800 leading-snug">{story.achievement}</p>
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-1.5 text-stone-400">
                                    <Calendar className="w-3 h-3" />
                                    <span className="text-[9px] font-bold uppercase tracking-wider">Intake</span>
                                </div>
                                <p className="text-sm font-semibold text-stone-800">{story.year}</p>
                            </div>
                        </div>

                        {/* Quote */}
                        <div className="relative pl-4 border-l-2 border-primary-500 bg-stone-50 p-4 rounded-r-lg">
                            <p className="text-sm text-stone-700 italic leading-relaxed font-medium">"{story.testimonial}"</p>
                        </div>

                        {/* Detailed Story */}
                        <div className="space-y-2">
                            <h3 className="text-sm font-serif font-bold text-stone-900 inline-block">The Journey</h3>
                            <p className="text-sm text-stone-600 leading-relaxed font-light">{story.detailedStory}</p>
                        </div>
                    </div>

                    {/* Footer Action */}
                    <div className="p-5 sm:p-6 border-t border-stone-100 bg-stone-50/50">
                        <button
                            onClick={onClose}
                            className="w-full py-3 rounded-lg bg-stone-900 text-white text-xs font-bold uppercase tracking-widest hover:bg-stone-800 transition-colors shadow-sm"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>

            <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap');
        .font-serif {
          font-family: 'Playfair Display', serif;
        }
      `}</style>
        </div>
    )
}
