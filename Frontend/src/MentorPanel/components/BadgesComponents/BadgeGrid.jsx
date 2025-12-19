import BadgeItem from "./BadgeItem"

const BadgeGrid = ({ badges }) => {
  if (!badges || badges.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No badges available</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
      {badges.map((badge) => (
        <BadgeItem key={badge.id} badge={badge} />
      ))}
    </div>
  )
}

export default BadgeGrid
