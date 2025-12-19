export default function KpiCard({ label, value, delta = "", trend = "up", subtitle = "", accent = "#5D38DE" }) {
  const isUp = trend === "up"
  return (
    <div className="rounded-xl border border-white/10 bg-[#161619] p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-white/70">{label}</p>
        {delta && (
          <span
            className={`text-xs px-2 py-1 rounded-md ${isUp ? "bg-emerald-500/15 text-emerald-400" : "bg-rose-500/15 text-rose-400"}`}
          >
            {delta}
          </span>
        )}
      </div>
      <div className="mt-1 flex items-end justify-between">
        <p className="text-3xl font-semibold tracking-tight">{value}</p>
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: accent }} />
      </div>
      {subtitle && <p className="mt-1 text-xs text-white/50">{subtitle}</p>}
    </div>
  )
}
  