import { Check } from "lucide-react"

export default function SaveBar({ dirty, saving, valid, onSave, onCancel, successMessage }) {
  if (!dirty && !successMessage) return null

  return (
    <div className="fixed bottom-0 inset-x-0 sm:static sm:inset-auto bg-white/90 backdrop-blur border-t sm:border-none z-40 transition-all duration-300">
      <div className="max-w-6xl mx-auto p-3 sm:p-0 flex sm:justify-end gap-2 mb-4 items-center">
        {successMessage ? (
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-50 text-emerald-600 font-medium animate-fade-in border border-emerald-100">
            <Check className="w-4 h-4" />
            <span>{successMessage}</span>
          </div>
        ) : (
          <>
            <button onClick={onCancel} className="px-4 py-2 rounded-lg bg-gray-100 text-sm hover:bg-gray-200 text-gray-700 font-medium transition-colors">Cancel</button>
            <button
              onClick={onSave}
              disabled={!valid || saving}
              className={`px-4 py-2 rounded-lg text-sm text-white font-medium transition-all duration-200 ${!valid || saving
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#5D38DE] hover:bg-[#4d2ec4] shadow-md hover:shadow-lg hover:-translate-y-0.5'
                }`}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}


