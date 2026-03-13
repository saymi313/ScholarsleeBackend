import { useEffect, useState } from "react"
import Sidebar from "../../components/Shared/Sidebar"
import TopBar from "../../components/Shared/TopBar"
import RevenueStats from "../../components/RevenueComponents/RevenueStats"
import GeneralSaleActivity from "../../components/RevenueComponents/GenerateSaleActivity"
import TopServices from "../../components/RevenueComponents/TopServices"
import VisitorInsights from "../../components/RevenueComponents/VisitorInsights"
import RecentlyJoinedStudents from "../../components/RevenueComponents/RecentlyJoinedStudents"
import { mentorRevenueAPI } from "../../../utils/api"

const Revenue = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError("")
        const response = await mentorRevenueAPI.getDashboard()
        if (response.data?.success) {
          setData(response.data.data)
        } else {
          setError(response.data?.message || "We couldn't load your revenue data. Please refresh the page.")
        }
      } catch (err) {
        setError(err.message || "We couldn't load your revenue data. Please refresh the page.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="flex h-screen bg-[#111111] text-white font-['Poppins']">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <TopBar />

        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          <div className="mb-6">
            <h1 className="text-3xl lg:text-4xl font-semibold mb-2">Revenue</h1>
            {error && (
              <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 px-3 py-2 rounded-lg max-w-xl">
                {error}
              </p>
            )}
          </div>

          <div className="flex flex-col lg:flex-row gap-6 h-full">
            <div className="flex-1 space-y-6">
              <RevenueStats data={data?.stats} loading={loading} />

              <GeneralSaleActivity data={data?.salesActivity} loading={loading} />

              <RecentlyJoinedStudents students={data?.recentStudents} loading={loading} />
            </div>

            <div className="lg:w-96 space-y-6">
              <TopServices services={data?.topServices} loading={loading} />
              <VisitorInsights data={data?.visitorInsights} loading={loading} />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Revenue
