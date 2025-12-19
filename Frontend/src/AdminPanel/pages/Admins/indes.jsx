"use client"

import React from "react"
import DataTable from "../../components/DataTable"
import { useAdminStore } from "../../state/AdminStore"

export default function AdminsPage() {
  const { state, actions } = useAdminStore()
  const columns = [
    { key: "name", header: "Name" },
    { key: "email", header: "Email" },
    { key: "role", header: "Role" },
    { key: "status", header: "Status" },
    {
      key: "actions",
      header: "Actions",
      render: (_, r) => (
        <div className="flex gap-2">
          <button className="px-2 py-1 rounded bg-white/5 text-xs">Edit</button>
          <button onClick={() => actions.setAdminStatus(r.id, r.status === 'active' ? 'disabled' : 'active')} className="px-2 py-1 rounded bg-rose-500/15 text-rose-300 text-xs">{r.status === 'active' ? 'Disable' : 'Enable'}</button>
        </div>
      ),
    },
  ]
  const rows = state.admins
  return (
    <section className="px-4 md:px-8 pb-10 space-y-6">
      <DataTable title="Admin Users" columns={columns} rows={rows} />
    </section>
  )
}
