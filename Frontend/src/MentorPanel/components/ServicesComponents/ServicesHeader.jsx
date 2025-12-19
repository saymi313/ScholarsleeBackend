import { Search } from "lucide-react"

const ServicesHeader = () => {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-semibold text-white mb-2">Welcome, Mentor!</h1>
          <p className="text-gray-400 text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </div>

        <button className="flex items-center gap-2 px-6 py-2.5 bg-[#5D38DE] text-white rounded-lg hover:bg-[#4d2bc4] transition-colors font-medium">
          Create
          <span className="text-xl">+</span>
        </button>
      </div>

      <div className="text-sm text-gray-400 mb-4">Your Services /</div>

      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by the name of the service"
            className="w-full bg-[#1a1a1a] text-white pl-12 pr-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-[#5D38DE] transition-colors"
          />
        </div>
        <button className="px-8 py-3 bg-[#5D38DE] text-white rounded-lg hover:bg-[#4d2bc4] transition-colors font-medium whitespace-nowrap">
          Search Service
        </button>
      </div>
    </div>
  )
}

export default ServicesHeader
