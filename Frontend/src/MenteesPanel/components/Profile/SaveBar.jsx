export default function SaveBar({ dirty, saving, valid, onSave, onCancel }) {
  if (!dirty) return null
  return (
    <div className="fixed bottom-0 inset-x-0 sm:static sm:inset-auto bg-white/90 backdrop-blur border-t sm:border-none z-40">
      <div className="max-w-6xl mx-auto p-3 sm:p-0 flex sm:justify-end gap-2 mb-4">
        <button onClick={onCancel} className="px-4 py-2 rounded-lg bg-gray-100 text-sm hover:bg-gray-200">Cancel</button>
        <button onClick={onSave} disabled={!valid || saving} className={`px-4 py-2 rounded-lg text-sm text-white ${!valid || saving ? 'bg-gray-400' : 'bg-[#5D38DE] hover:bg-[#6d48ee]'}`}>{saving ? 'Saving…' : 'Save changes'}</button>
      </div>
    </div>
  )
}


