import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const VisitorInsights = ({ data = [], loading }) => {
  const chartData = data.length
    ? data.map((item) => ({
        month: item.label,
        succeeded: item.succeeded,
        pending: item.pending,
        refunded: item.refunded,
      }))
    : [{ month: 'No data', succeeded: 0, pending: 0, refunded: 0 }]

  return (
    <div className="bg-[#242424] rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-6">Payment Status Trends</h2>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="month" stroke="#666" tick={{ fill: "#999", fontSize: 11 }} axisLine={{ stroke: "#333" }} />
            <YAxis stroke="#666" tick={{ fill: "#999", fontSize: 11 }} axisLine={{ stroke: "#333" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1a1a1a",
                border: "1px solid #333",
                borderRadius: "8px",
                color: "#fff",
              }}
            />
            <Line type="monotone" dataKey="succeeded" stroke="#22c55e" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="pending" stroke="#f97316" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="refunded" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center gap-6 mt-4 text-sm text-gray-400">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span>Succeeded</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-orange-500"></div>
          <span>Pending</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span>Refunded</span>
        </div>
      </div>
    </div>
  )
}

export default VisitorInsights
