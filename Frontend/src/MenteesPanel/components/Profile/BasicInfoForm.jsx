export default function BasicInfoForm({ value, onChange }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
      <div className="col-span-1 sm:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">Full name<span className="text-red-500">*</span></label>
        <input value={value.fullName} onChange={(e)=> onChange({ fullName: e.target.value })} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5D38DE]" placeholder="Your full name" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Headline<span className="text-red-500">*</span></label>
        <input value={value.headline} onChange={(e)=> onChange({ headline: e.target.value })} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5D38DE]" placeholder="e.g., AI Engineer" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Location<span className="text-red-500">*</span></label>
        <input value={value.location} onChange={(e)=> onChange({ location: e.target.value })} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5D38DE]" placeholder="City, Country" />
      </div>
    </div>
  )
}


