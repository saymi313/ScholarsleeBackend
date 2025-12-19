import Sidebar from "../../components/Shared/Sidebar"
import TopBar from "../../components/Shared/TopBar"
import StatsGrid from "../../components/DashboardComponents/StatsGrid"
import SessionsTable from "../../components/DashboardComponents/SessionsTables"
import StudentsChart from "../../components/DashboardComponents/StudentsChart"
import TimeSpentChart from "../../components/DashboardComponents/TimeSpentChart"

const Dashboard = () => {
  return (
    <div className="flex min-h-screen bg-[#111111] text-white font-['Poppins']">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <TopBar />

        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          {/* Welcome section removed - showing real data only */}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <StatsGrid />
              <SessionsTable />
            </div>

            <div className="space-y-6">
              <StudentsChart />
              <TimeSpentChart />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Dashboard
