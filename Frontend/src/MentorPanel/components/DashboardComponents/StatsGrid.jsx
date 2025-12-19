import StatsCard from "./StatsCards"
import { Users, DollarSign, BookOpen, ShoppingCart, CheckCircle, Package } from "lucide-react"

const StatsGrid = () => {
  const stats = [
    {
      icon: Users,
      label: "Total students",
      value: "0",
      bgColor: "bg-blue-500/20",
      iconColor: "text-blue-500",
    },
    {
      icon: DollarSign,
      label: "Total sales",
      value: "$0.00",
      bgColor: "bg-green-500/20",
      iconColor: "text-green-500",
    },
    {
      icon: BookOpen,
      label: "Total Services",
      value: "0",
      bgColor: "bg-teal-500/20",
      iconColor: "text-teal-500",
    },
    {
      icon: ShoppingCart,
      label: "Processing Orders",
      value: "0",
      bgColor: "bg-purple-500/20",
      iconColor: "text-purple-500",
    },
    {
      icon: CheckCircle,
      label: "Completed Orders",
      value: "0",
      bgColor: "bg-red-500/20",
      iconColor: "text-red-500",
    },
    {
      icon: Package,
      label: "Total orders",
      value: "0",
      bgColor: "bg-orange-500/20",
      iconColor: "text-orange-500",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <StatsCard key={index} {...stat} />
      ))}
    </div>
  )
}

export default StatsGrid
