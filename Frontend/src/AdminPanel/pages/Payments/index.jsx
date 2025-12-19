"use client"

import React from "react"
import DataTable from "../../components/DataTable"
import { useAdminStore } from "../../state/AdminStore"

export default function PaymentsPage() {
  const { state, actions } = useAdminStore()

  const txColumns = [
    { key: "id", header: "Id" },
    { key: "user", header: "User" },
    { key: "amount", header: "Amount" },
    { key: "method", header: "Method" },
    { key: "status", header: "Status" },
    { key: "createdAt", header: "CreatedAt" },
  ]
  const txRows = state.transactions

  const payoutColumns = [
    { key: "mentor", header: "Mentor" },
    { key: "balance", header: "Balance" },
    { key: "status", header: "Status" },
    {
      key: "actions",
      header: "Actions",
      render: (_, r) => <button onClick={() => actions.approvePayout(r.id)} className="px-2 py-1 rounded bg-[#5D38DE] text-xs">Approve Payout</button>,
    },
  ]
  const payoutRows = state.payouts

  return (
    <section className="px-4 md:px-8 pb-10 space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-white/10 bg-[#161619] p-4">
          <p className="text-sm text-white/70">GMV</p>
          <p className="text-2xl font-semibold mt-1">$126,420</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-[#161619] p-4">
          <p className="text-sm text-white/70">Refunds %</p>
          <p className="text-2xl font-semibold mt-1">2.1%</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-[#161619] p-4">
          <p className="text-sm text-white/70">Pending Payouts</p>
          <p className="text-2xl font-semibold mt-1">$8,340</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-[#161619] p-4">
          <p className="text-sm text-white/70">Transactions</p>
          <p className="text-2xl font-semibold mt-1">2,430</p>
        </div>
      </div>

      <DataTable title="Transactions" columns={txColumns} rows={txRows} />
      <DataTable title="Payout Requests" columns={payoutColumns} rows={payoutRows} />
    </section>
  )
}
