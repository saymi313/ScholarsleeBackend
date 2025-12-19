export default function ContactForm({ value, onChange }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email<span className="text-red-500">*</span></label>
        <input type="email" value={value.email} onChange={(e)=> onChange({ email: e.target.value })} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5D38DE]" placeholder="name@example.com" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
        <input value={value.phone} onChange={(e)=> onChange({ phone: e.target.value })} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5D38DE]" placeholder="+00 123 456789" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
        <input value={value.website} onChange={(e)=> onChange({ website: e.target.value })} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5D38DE]" placeholder="https://" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
        <input value={value.linkedin} onChange={(e)=> onChange({ linkedin: e.target.value })} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5D38DE]" placeholder="https://linkedin.com/in/.." />
      </div>
    </div>
  )
}


