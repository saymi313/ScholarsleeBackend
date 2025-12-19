const Connections = ({ mentorData }) => {
    const connectionsData = mentorData?.connections || []
    
    const connections = connectionsData.map((conn, index) => ({
      id: conn._id || index + 1,
      name: `${conn.profile?.firstName || ''} ${conn.profile?.lastName || ''}`.trim() || 'Unknown',
      title: conn.email || '',
      avatar: conn.profile?.avatar || "/u.jpeg",
    }))
    
    // If no connections, show a placeholder
    if (connections.length === 0) {
      connections.push({
        id: 1,
        name: "No connections yet",
        title: "This mentor hasn't connected with anyone yet",
        avatar: "/u.jpeg",
      })
    }
  
    return (
      <div className="max-w-4xl">
        <div className="space-y-4">
          {connections.map((connection) => (
            <div
              key={connection.id}
              className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                  <img
                    src={connection.avatar}
                    alt={connection.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{connection.name}</h3>
                  <p className="text-sm text-gray-600">{connection.title}</p>
                </div>
              </div>
              <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                Unfollow
              </button>
            </div>
          ))}
        </div>
      </div>
    )
  }
  
  export default Connections
  