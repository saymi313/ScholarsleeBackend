import { useState, useImperativeHandle, forwardRef, useEffect } from "react"
import { Clock, Globe, Calendar } from "lucide-react"

const DAYS_OF_WEEK = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
]

const TIMEZONES = Intl.supportedValuesOf('timeZone');
// Add some common aliases or specific ones if needed, but Intl is quite comprehensive

const AvailabilitySection = forwardRef(({ initialData }, ref) => {
    const [availability, setAvailability] = useState({
        timezone: "UTC",
        workingHours: "9 AM - 5 PM",
        daysAvailable: [],
    })

    useEffect(() => {
        if (initialData) {
            setAvailability({
                timezone: initialData.timezone || "UTC",
                workingHours: initialData.workingHours || "9 AM - 5 PM",
                daysAvailable: initialData.daysAvailable || [],
            })
        }
    }, [initialData])

    useImperativeHandle(ref, () => ({
        getData: () => availability,
        reset: () => {
            if (initialData) {
                setAvailability({
                    timezone: initialData.timezone || "UTC",
                    workingHours: initialData.workingHours || "9 AM - 5 PM",
                    daysAvailable: initialData.daysAvailable || [],
                })
            }
        },
    }))

    const handleDayToggle = (day) => {
        setAvailability((prev) => ({
            ...prev,
            daysAvailable: prev.daysAvailable.includes(day)
                ? prev.daysAvailable.filter((d) => d !== day)
                : [...prev.daysAvailable, day],
        }))
    }

    return (
        <div className="bg-[#1a1a1a] rounded-2xl p-4 sm:p-6 border border-[#2a2a2a] space-y-6">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-[#5D38DE]/10 rounded-lg">
                    <Clock className="w-5 h-5 text-[#5D38DE]" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white">Available Hours</h3>
                    <p className="text-gray-400 text-sm">Set your generic availability for all mentees</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Timezone */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                        <Globe className="w-4 h-4 text-gray-500" />
                        Timezone
                    </label>
                    <select
                        value={availability.timezone}
                        onChange={(e) => setAvailability({ ...availability, timezone: e.target.value })}
                        className="w-full bg-[#242424] border border-[#3a3a3a] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#5D38DE] transition-colors"
                    >
                        {TIMEZONES.map((tz) => (
                            <option key={tz} value={tz}>
                                {tz}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Working Hours */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        Working Hours
                    </label>
                    <input
                        type="text"
                        value={availability.workingHours}
                        onChange={(e) => setAvailability({ ...availability, workingHours: e.target.value })}
                        placeholder="e.g. 9 AM - 5 PM or Flexible"
                        className="w-full bg-[#242424] border border-[#3a3a3a] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#5D38DE] transition-colors"
                    />
                </div>
            </div>

            {/* Days Available */}
            <div className="space-y-3">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    Days Available
                </label>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                    {DAYS_OF_WEEK.map((day) => {
                        const isSelected = availability.daysAvailable.includes(day)
                        return (
                            <button
                                key={day}
                                type="button"
                                onClick={() => handleDayToggle(day)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${isSelected
                                    ? "bg-[#5D38DE] text-white border-[#5D38DE] shadow-lg shadow-purple-500/20"
                                    : "bg-[#242424] text-gray-400 border-[#3a3a3a] hover:border-gray-500"
                                    }`}
                            >
                                {day}
                            </button>
                        )
                    })}
                </div>
            </div>
        </div>
    )
})

AvailabilitySection.displayName = "AvailabilitySection"

export default AvailabilitySection
