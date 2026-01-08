import React from 'react'

const colors = ["bg-blue-500", "bg-teal-500", "bg-purple-500", "bg-orange-500"]

const formatCurrency = (value = 0) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value / 100)

const TopServices = ({ services = [], loading }) => {
  if (loading) {
    return (
      <div className="bg-[#242424] rounded-xl p-6 animate-pulse">
        <h2 className="text-lg font-semibold mb-6">Top Services</h2>
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="h-10 bg-gray-700/40 rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  if (!services.length) {
    return (
      <div className="bg-[#242424] rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-2">Top Services</h2>
        <p className="text-sm text-gray-400">No sales recorded yet.</p>
      </div>
    )
  }

  const maxRevenue = Math.max(...services.map((s) => s.revenue || 0), 1)

  return (
    <div className="bg-[#242424] rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-6">Top Services</h2>

      <div className="space-y-4">
        <div className="grid grid-cols-12 gap-4 text-sm text-gray-400 pb-3 border-b border-gray-700">
          <div className="col-span-1">#</div>
          <div className="col-span-5">Name</div>
          <div className="col-span-4">Popularity</div>
          <div className="col-span-2 text-right">Revenue</div>
        </div>

        {services.map((service, index) => {
          const popularity = Math.round(((service.revenue || 0) / maxRevenue) * 100)
          return (
            <div key={service.serviceId || index} className="grid grid-cols-12 gap-4 items-center py-2">
              <div className="col-span-1 text-gray-400">{String(service.rank || index + 1).padStart(2, '0')}</div>
              <div className="col-span-5 text-sm">{service.name}</div>
              <div className="col-span-4">
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className={`${colors[index % colors.length]} h-2 rounded-full transition-all duration-300`}
                    style={{ width: `${popularity}%` }}
                  />
                </div>
              </div>
              <div className="col-span-2 text-right">
                <span className="bg-gray-700 text-white px-3 py-1 rounded-full text-xs font-medium">
                  {formatCurrency(service.revenue)}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default TopServices