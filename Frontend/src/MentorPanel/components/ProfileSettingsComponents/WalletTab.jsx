import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { walletAPI } from "../../../utils/api"
import { Wallet, ArrowRight, DollarSign, ShieldCheck } from "lucide-react"

const WalletTab = () => {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await walletAPI.getData()
                if (response.data?.success) {
                    setData(response.data.data)
                }
            } catch (err) {
                console.error("Failed to load wallet data")
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading wallet info...</div>
    }

    return (
        <div className="bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] p-6 sm:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400">
                        <Wallet size={32} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold">Payments & Wallet</h3>
                        <p className="text-gray-400 text-sm">Configure your payout methods and monitor earnings.</p>
                    </div>
                </div>
                <button
                    onClick={() => navigate("/mentor/wallet")}
                    className="flex items-center gap-2 px-6 py-3 bg-[#5D38DE] hover:bg-[#4c2db3] text-white rounded-xl font-bold transition-all shadow-lg"
                >
                    Manage Wallet
                    <ArrowRight size={18} />
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                <div className="bg-[#242424] p-6 rounded-2xl border border-[#333]">
                    <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase mb-2">
                        <DollarSign size={14} />
                        Available Balance
                    </div>
                    <div className="text-3xl font-bold">${data?.wallet.availableBalance.toFixed(2) || "0.00"}</div>
                </div>

                <div className="bg-[#242424] p-6 rounded-2xl border border-[#333]">
                    <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase mb-2">
                        <ShieldCheck size={14} />
                        Active Payout Methods
                    </div>
                    <div className="text-3xl font-bold">{data?.payoutMethods.length || 0}</div>
                </div>
            </div>
        </div>
    )
}

export default WalletTab
