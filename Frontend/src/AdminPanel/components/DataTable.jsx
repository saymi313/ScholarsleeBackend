"use client"

import { useMemo, useState } from "react"

export default function DataTable({ columns, rows, filters, title }) {
  const [query, setQuery] = useState("")
  const [queryError, setQueryError] = useState("")
  const [page, setPage] = useState(1)
  const pageSize = 10

  const filtered = useMemo(() => {
    let data = rows || []
    if (query) {
      const q = query.toLowerCase()
      data = data.filter((r) => Object.values(r).some((v) => String(v).toLowerCase().includes(q)))
    }
    if (filters) {
      for (const f of filters) {
        if (f.value && f.value !== "all") {
          data = data.filter((r) => String(r[f.key]).toLowerCase() === String(f.value).toLowerCase())
        }
      }
    }
    return data
  }, [rows, query, filters])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const start = (page - 1) * pageSize
  const slice = filtered.slice(start, start + pageSize)

  return (
    <div className="rounded-xl border border-white/10 bg-[#161619]">
      <div className="p-4 border-b border-white/10 flex items-center gap-3">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="ml-auto">
          <input
            value={query}
            maxLength={64}
            onChange={(e) => {
              const v = e.target.value
              if (/^[\p{L}\p{N}\s.,@_-]*$/u.test(v)) {
                setQueryError("")
                setQuery(v)
                setPage(1)
              } else {
                setQueryError("Only letters, numbers, spaces, and .,@_- allowed.")
              }
            }}
            placeholder="Search..."
            className="bg-[#0f0f12] border border-white/10 rounded-md px-3 py-2 text-sm w-56 focus:outline-none"
          />
          {queryError && <p className="mt-1 text-xs text-rose-300">{queryError}</p>}
        </div>
      </div>
      <div className="max-h-[520px] overflow-y-auto">
        <table className="w-full text-sm table-fixed">
          <thead className="bg-white/5">
            <tr className="text-left">
              {columns.map((c) => (
                <th key={c.key} className="px-4 py-3 font-medium text-white/80">
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {slice.map((r, i) => (
              <tr key={i} className="border-t border-white/10">
                {columns.map((c) => (
                  <td key={c.key} className={`px-4 py-3 ${c.key === 'actions' ? 'whitespace-nowrap' : 'whitespace-normal break-words'}`}>
                    {c.render ? c.render(r[c.key], r) : r[c.key]}
                  </td>
                ))}
              </tr>
            ))}
            {slice.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-white/50">
                  No results
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between p-4 border-t border-white/10">
        <div className="text-xs text-white/60">
          Page {page} of {totalPages} • {filtered.length} results
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1.5 rounded-md bg-white/5 hover:bg-white/10 text-sm"
          >
            Prev
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="px-3 py-1.5 rounded-md bg-white/5 hover:bg-white/10 text-sm"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
