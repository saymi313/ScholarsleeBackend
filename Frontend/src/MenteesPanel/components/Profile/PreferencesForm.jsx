export default function PreferencesForm({ value = {}, onChange }) {
  const update = (patch) => onChange?.({ ...(value || {}), ...patch })
  return (
    <div className="space-y-3">
      <label className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2 border">
        <span className="text-sm text-gray-700">Email notifications</span>
        <input type="checkbox" checked={!!value.notifications} onChange={(e)=> update({ notifications: e.target.checked })} />
      </label>
      <label className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2 border">
        <span className="text-sm text-gray-700">Public profile</span>
        <input type="checkbox" checked={!!value.publicProfile} onChange={(e)=> update({ publicProfile: e.target.checked })} />
      </label>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
        <select value={value.timezone || "UTC"} onChange={(e)=> update({ timezone: e.target.value })} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5D38DE]">
          <option value="UTC">UTC</option>
          <option value="Europe/Berlin">Europe/Berlin</option>
          <option value="America/New_York">America/New_York</option>
          <option value="Asia/Karachi">Asia/Karachi</option>
        </select>
      </div>
    </div>
  )
}


