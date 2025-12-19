const StatsCard = ({ icon: Icon, label, value, bgColor, iconColor }) => {
    return (
      <div className="bg-[#242424] rounded-xl p-6 hover:bg-[#2a2a2a] transition-colors">
        <div className="flex items-center gap-4">
          <div className={`${bgColor} ${iconColor} p-3 rounded-full`}>
            <Icon size={24} />
          </div>
          <div>
            <p className="text-gray-400 text-xs mb-1">{label}</p>
            <p className="text-white text-2xl font-semibold">{value}</p>
          </div>
        </div>
      </div>
    )
  }
  
  export default StatsCard
  