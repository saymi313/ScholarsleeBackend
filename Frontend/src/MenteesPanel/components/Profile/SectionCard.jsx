export default function SectionCard({ title, description, required, children }) {
  return (
    <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6">
      <div className="mb-4">
        <h3 className="text-lg sm:text-xl font-semibold text-[#111111] flex items-center gap-2">
          {title}
          {required && <span className="text-xs text-red-500">*</span>}
        </h3>
        {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
      </div>
      <div className="min-w-0">
        {children}
      </div>
    </section>
  )
}


