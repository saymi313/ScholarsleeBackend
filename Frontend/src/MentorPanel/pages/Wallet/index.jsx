import { useEffect, useState } from "react"
import { useToast } from "../../../context/ToastContext"
import Sidebar from "../../components/Shared/Sidebar"
import TopBar from "../../components/Shared/TopBar"
import { walletAPI } from "../../../utils/api"
import {
    Wallet,
    ArrowUpRight,
    ArrowDownLeft,
    Plus,
    Trash2,
    AlertCircle,
    CheckCircle2,
    Clock,
    DollarSign,
    Building2,
    PhoneCall,
    Mail,
    Edit3,
    CreditCard,
    TrendingUp,
    X
} from "lucide-react"
import PayoutDebitCard from "../../components/WalletComponents/PayoutDebitCard"

const WalletPage = () => {
    const { showError } = useToast()
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [showWithdrawModal, setShowWithdrawModal] = useState(false)
    const [showAddMethodModal, setShowAddMethodModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [methodToDelete, setMethodToDelete] = useState(null)

    // Withdrawal Form State
    const [withdrawAmount, setWithdrawAmount] = useState("")
    const [selectedMethodId, setSelectedMethodId] = useState("")
    const [withdrawLoading, setWithdrawLoading] = useState(false)
    const [withdrawSuccess, setWithdrawSuccess] = useState(false)

    // Add Method Form State
    const [newMethod, setNewMethod] = useState({
        type: "Bank Transfer",
        bankName: "",
        country: "",
        accountNumber: "",
        accountTitle: "",
        isDefault: false
    })

    useEffect(() => {
        fetchWalletData()
    }, [])

    const fetchWalletData = async () => {
        try {
            setLoading(true)
            const response = await walletAPI.getData()
            if (response.data?.success) {
                setData(response.data.data)
                // Set default method if available
                const defaultMethod = response.data.data.payoutMethods.find(m => m.isDefault)
                if (defaultMethod) setSelectedMethodId(defaultMethod._id)
                else if (response.data.data.payoutMethods.length > 0) setSelectedMethodId(response.data.data.payoutMethods[0]._id)
            }
        } catch (err) {
            setError("We couldn't load your wallet. Please refresh the page.")
        } finally {
            setLoading(false)
        }
    }

    const handleAddMethod = async (e) => {
        e.preventDefault()
        try {
            let response;
            if (newMethod._id) {
                response = await walletAPI.updatePayoutMethod(newMethod._id, newMethod)
            } else {
                response = await walletAPI.addPayoutMethod(newMethod)
            }

            if (response.data?.success) {
                setNewMethod({ type: "Bank Transfer", bankName: "", country: "", accountNumber: "", accountTitle: "", isDefault: false })
                setShowAddMethodModal(false)
                fetchWalletData()
            }
        } catch (err) {
            showError(err.response?.data?.message || "We couldn't save your payout method. Please try again.")
        }
    }

    const handleEditMethod = (method) => {
        setNewMethod(method)
        setShowAddMethodModal(true)
    }

    const initiateDelete = (id) => {
        const method = data.payoutMethods.find(m => m._id === id);
        setMethodToDelete(method);
        setShowDeleteModal(true);
    }

    const confirmDeleteMethod = async () => {
        if (!methodToDelete) return;
        try {
            await walletAPI.deletePayoutMethod(methodToDelete._id)
            setShowDeleteModal(false)
            setMethodToDelete(null)
            fetchWalletData()
        } catch (err) {
            showError("We couldn't delete this method. Please try again.")
        }
    }

    const handleWithdraw = async (e) => {
        e.preventDefault()
        if (parseFloat(withdrawAmount) < 50) return

        setWithdrawLoading(true)
        try {
            const response = await walletAPI.withdraw({
                amount: parseFloat(withdrawAmount),
                payoutMethodId: selectedMethodId
            })
            if (response.data?.success) {
                setWithdrawSuccess(true)
                setTimeout(() => {
                    setWithdrawSuccess(false)
                    setShowWithdrawModal(false)
                    fetchWalletData()
                }, 3000)
            }
        } catch (err) {
            showError(err.message || "Withdrawal failed")
        } finally {
            setWithdrawLoading(false)
        }
    }

    const renderStatusBadge = (status) => {
        const configs = {
            pending: { color: "text-yellow-400 bg-yellow-400/10", icon: Clock },
            processing: { color: "text-blue-400 bg-blue-400/10", icon: Clock },
            completed: { color: "text-green-400 bg-green-400/10", icon: CheckCircle2 },
            rejected: { color: "text-red-400 bg-red-400/10", icon: AlertCircle },
        }
        const config = configs[status] || configs.pending
        return (
            <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}>
                <config.icon size={12} />
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        )
    }

    return (
        <div className="flex h-screen bg-[#111111] text-white font-['Poppins']">
            <Sidebar />
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <TopBar />
                <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Mentor Wallet</h1>
                            <p className="text-gray-400 text-sm">Manage your earnings and manual withdrawal requests.</p>
                        </div>
                        <button
                            onClick={() => setShowWithdrawModal(true)}
                            disabled={!data || data.wallet.availableBalance < 50}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all
                ${data && data.wallet.availableBalance >= 50
                                    ? "bg-[#5D38DE] hover:bg-[#4c2db3] text-white shadow-lg shadow-indigo-500/20"
                                    : "bg-gray-800 text-gray-500 cursor-not-allowed"
                                }`}
                        >
                            <ArrowUpRight size={20} />
                            Withdraw Funds
                        </button>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-6 rounded-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Wallet size={80} />
                            </div>
                            <p className="text-gray-400 text-sm font-medium mb-1">Available Balance</p>
                            <h2 className="text-4xl font-bold text-white mb-2">
                                ${data?.wallet.availableBalance.toFixed(2) || "0.00"}
                            </h2>
                            <div className="flex items-center gap-2 text-xs text-indigo-400">
                                <AlertCircle size={14} />
                                <span>Min withdrawal: $50.00</span>
                            </div>
                        </div>

                        <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-6 rounded-2xl">
                            <p className="text-gray-400 text-sm font-medium mb-1">Total Withdrawn</p>
                            <h2 className="text-4xl font-bold text-white mb-2">
                                ${data?.wallet.totalWithdrawn.toFixed(2) || "0.00"}
                            </h2>
                            <p className="text-xs text-green-400">Successfully paid out</p>
                        </div>

                        <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-6 rounded-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <TrendingUp size={80} />
                            </div>
                            <p className="text-gray-400 text-sm font-medium mb-1">Total Earnings</p>
                            <h2 className="text-4xl font-bold text-white mb-2">
                                ${data?.wallet.totalEarnings?.toFixed(2) || "0.00"}
                            </h2>
                            <p className="text-xs text-gray-400">Lifetime earnings (Pre-fees)</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Payout Methods & Withdrawal History */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Payout Methods - New Aesthetic Card View */}
                            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-3xl p-8">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                                    <div>
                                        <h3 className="text-xl font-bold">Payout Methods</h3>
                                        <p className="text-xs text-gray-500 mt-1">Select your preferred receiving card. Enter your bank details.</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setNewMethod({ type: "Bank Transfer", bankName: "", country: "", accountNumber: "", accountTitle: "", isDefault: false });
                                            setShowAddMethodModal(true);
                                        }}
                                        className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-500/10 text-indigo-400 rounded-2xl hover:bg-indigo-500 hover:text-white transition-all font-bold text-xs"
                                    >
                                        <Plus size={16} />
                                        Add New Card
                                    </button>
                                </div>

                                <div className="flex flex-col items-center sm:flex-row sm:flex-wrap sm:justify-start gap-6">
                                    {data?.payoutMethods.length > 0 ? (
                                        data.payoutMethods.map((method) => (
                                            <PayoutDebitCard
                                                key={method._id}
                                                method={method}
                                                onDelete={initiateDelete}
                                                onEdit={handleEditMethod}
                                                isDefault={method.isDefault}
                                            />
                                        ))
                                    ) : (
                                        <div
                                            onClick={() => setShowAddMethodModal(true)}
                                            className="w-full max-w-[400px] h-[240px] rounded-3xl border-2 border-dashed border-[#2a2a2a] flex flex-col items-center justify-center text-gray-600 hover:text-indigo-400 hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all cursor-pointer group"
                                        >
                                            <div className="w-16 h-16 rounded-full bg-[#1a1a1a] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                                <CreditCard size={32} />
                                            </div>
                                            <p className="text-sm font-bold">No payout cards linked</p>
                                            <p className="text-[10px] uppercase tracking-widest mt-1">Click to add your first card</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Withdrawal History */}
                            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl overflow-hidden">
                                <div className="p-6 border-b border-[#2a2a2a] flex items-center justify-between">
                                    <h3 className="text-lg font-bold flex items-center gap-2">
                                        <ArrowDownLeft size={20} className="text-blue-400" />
                                        Withdrawal History
                                    </h3>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-[#242424] text-gray-400 font-medium">
                                            <tr>
                                                <th className="px-6 py-4">Date</th>
                                                <th className="px-6 py-4">Method</th>
                                                <th className="px-6 py-4">Amount</th>
                                                <th className="px-6 py-4">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#2a2a2a]">
                                            {data?.payoutRequests.length > 0 ? (
                                                data.payoutRequests.map((request) => (
                                                    <tr key={request._id} className="hover:bg-[#242424] transition-colors">
                                                        <td className="px-6 py-4 text-gray-300">
                                                            {new Date(request.createdAt).toLocaleDateString()}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex flex-col">
                                                                <span className="font-medium">{request.payoutMethod.type}</span>
                                                                <span className="text-[10px] text-gray-500">{request.payoutMethod.accountNumber}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex flex-col">
                                                                <span className="font-bold text-white">${(request.netAmount || request.amount).toFixed(2)}</span>
                                                                {request.platformFee > 0 && (
                                                                    <span className="text-[10px] text-gray-500">Gross: ${request.amount.toFixed(2)} (-20% fee)</span>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            {renderStatusBadge(request.status)}
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                                                        No withdrawal requests yet.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Recent Earnings & Info */}
                        <div className="space-y-6">
                            <div className="bg-gradient-to-br from-indigo-900/40 to-[#1a1a1a] border border-indigo-500/20 rounded-2xl p-6 space-y-5">
                                <h3 className="text-lg font-bold flex items-center gap-2 text-indigo-400 border-b border-white/5 pb-4">
                                    <AlertCircle size={20} />
                                    IMPORTANT NOTICE
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-bold text-white mb-1.5 flex items-center gap-2">
                                            <DollarSign size={16} className="text-indigo-400" />
                                            Platform Service Fee
                                        </h4>
                                        <p className="text-xs text-gray-300 leading-relaxed">
                                            A flat <span className="text-indigo-400 font-bold">20% system commission</span> is applied to each withdrawal. This fee covers platform maintenance, secure payment processing, and mentor support services.
                                        </p>
                                    </div>

                                    <div className="pt-4 border-t border-white/5">
                                        <h4 className="font-bold text-white mb-1.5 flex items-center gap-2">
                                            <Clock size={16} className="text-indigo-400" />
                                            Disbursement Timeline
                                        </h4>
                                        <p className="text-xs text-gray-300 leading-relaxed">
                                            Withdrawals are processed manually within <span className="text-white font-bold">24-48 business hours</span>. Ensure your account title matches your ID for successful bank transfers.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Earnings */}
                            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl overflow-hidden">
                                <div className="p-6 border-b border-[#2a2a2a]">
                                    <h3 className="text-lg font-bold flex items-center gap-2 text-green-400">
                                        <DollarSign size={20} />
                                        Recent Earnings
                                    </h3>
                                </div>
                                <div className="p-6 space-y-4">
                                    {data?.recentEarnings.length > 0 ? (
                                        data.recentEarnings.map((earning) => (
                                            <div key={earning._id} className="flex items-center justify-between p-4 bg-[#242424] rounded-xl border border-transparent hover:border-indigo-500/30 transition-all">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-semibold">{earning.serviceTitle}</span>
                                                    <span className="text-[10px] text-gray-500">{new Date(earning.createdAt).toLocaleString()}</span>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-sm font-bold text-green-400">+${earning.mentorAmount.toFixed(2)}</span>
                                                    <p className="text-[10px] text-gray-500">Net</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-center py-6 text-gray-500">No earnings recorded yet.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* --- MODALS --- */}

            {/* Withdrawal Modal */}
            {showWithdrawModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-[#1a1a1a] border border-[#2a2a2a] w-full max-w-md rounded-3xl p-8 shadow-2xl relative">
                        <button
                            onClick={() => setShowWithdrawModal(false)}
                            className="absolute top-6 right-6 text-gray-500 hover:text-white"
                        >
                            <X size={24} />
                        </button>

                        {!withdrawSuccess ? (
                            <>
                                <h2 className="text-2xl font-bold mb-2">Withdraw Funds</h2>
                                <p className="text-gray-400 text-sm mb-6">Submit a request for manual payout.</p>

                                <form onSubmit={handleWithdraw} className="space-y-6">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Select Payout Method</label>
                                        <select
                                            value={selectedMethodId}
                                            onChange={(e) => setSelectedMethodId(e.target.value)}
                                            className="w-full bg-[#242424] border border-[#333] rounded-xl px-4 py-3.5 focus:border-indigo-500 focus:ring-0 outline-none transition-all text-sm"
                                            required
                                        >
                                            <option value="">Select a method...</option>
                                            {data?.payoutMethods.map(m => (
                                                <option key={m._id} value={m._id}>{m.type} - {m.accountNumber}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Amount (Min $50)</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                                            <input
                                                type="number"
                                                min="50"
                                                step="0.01"
                                                max={data?.wallet.availableBalance}
                                                value={withdrawAmount}
                                                onChange={(e) => setWithdrawAmount(e.target.value)}
                                                placeholder="0.00"
                                                className="w-full bg-[#242424] border border-[#333] rounded-xl pl-8 pr-4 py-3.5 focus:border-indigo-500 focus:ring-0 outline-none transition-all font-bold text-white"
                                                required
                                            />
                                        </div>
                                        <p className="mt-2 text-[10px] text-gray-500 mb-4">Max available: ${data?.wallet.availableBalance.toFixed(2)}</p>

                                        {/* Fee Breakdown */}
                                        {parseFloat(withdrawAmount) >= 50 && (
                                            <div className="bg-[#242424] border border-[#333] rounded-2xl p-4 space-y-2 animate-in fade-in slide-in-from-top-2">
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-gray-400">Gross Requested:</span>
                                                    <span className="text-white font-medium">${parseFloat(withdrawAmount).toFixed(2)}</span>
                                                </div>
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-gray-400">Platform Fee (20%):</span>
                                                    <span className="text-red-400 font-medium">-${(parseFloat(withdrawAmount) * 0.20).toFixed(2)}</span>
                                                </div>
                                                <div className="pt-2 border-t border-[#333] flex justify-between text-sm font-bold">
                                                    <span className="text-indigo-400">Estimated Net Payout:</span>
                                                    <span className="text-green-400">${(parseFloat(withdrawAmount) * 0.80).toFixed(2)}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={withdrawLoading || !selectedMethodId || parseFloat(withdrawAmount) < 50}
                                        className="w-full bg-[#5D38DE] hover:bg-[#4c2db3] disabled:bg-gray-800 disabled:text-gray-500 py-4 rounded-xl font-bold transition-all shadow-lg"
                                    >
                                        {withdrawLoading ? "Processing..." : "Confirm Withdrawal"}
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-green-500/10 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle2 size={32} />
                                </div>
                                <h2 className="text-xl font-bold mb-2">Request Submitted!</h2>
                                <p className="text-gray-400 text-sm">Your withdrawal request for <span className="text-white font-bold">${parseFloat(withdrawAmount).toFixed(2)}</span> has been received. You will receive a net amount of <span className="text-green-400 font-bold">${(parseFloat(withdrawAmount) * 0.80).toFixed(2)}</span> after the 20% platform fee.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Add Method Modal */}
            {showAddMethodModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-[#1a1a1a] border border-[#2a2a2a] w-full max-w-md rounded-3xl p-8 shadow-2xl relative">
                        <button
                            onClick={() => setShowAddMethodModal(false)}
                            className="absolute top-6 right-6 text-gray-500 hover:text-white"
                        >
                            <X size={24} />
                        </button>
                        <h2 className="text-2xl font-bold mb-2">{newMethod._id ? 'Edit Payout Card' : 'Link Payout Card'}</h2>
                        <p className="text-gray-400 text-sm mb-6">Enter your account details to receive payouts.</p>

                        <form onSubmit={handleAddMethod} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Payout Type</label>
                                <div className="w-full bg-[#242424] border border-[#333] rounded-xl px-4 py-3.5 text-sm text-gray-500 font-bold">
                                    Bank Transfer
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Bank Name</label>
                                    <input
                                        type="text"
                                        value={newMethod.bankName}
                                        onChange={(e) => setNewMethod({ ...newMethod, bankName: e.target.value })}
                                        placeholder="e.g. Standard Chartered"
                                        className="w-full bg-[#242424] border border-[#333] rounded-xl px-4 py-3.5 text-sm"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Country</label>
                                    <input
                                        type="text"
                                        value={newMethod.country}
                                        onChange={(e) => setNewMethod({ ...newMethod, country: e.target.value })}
                                        placeholder="e.g. United Kingdom"
                                        className="w-full bg-[#242424] border border-[#333] rounded-xl px-4 py-3.5 text-sm"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Account Title</label>
                                    <input
                                        type="text"
                                        value={newMethod.accountTitle}
                                        onChange={(e) => setNewMethod({ ...newMethod, accountTitle: e.target.value })}
                                        placeholder="e.g. Usman Awan"
                                        className="w-full bg-[#242424] border border-[#333] rounded-xl px-4 py-3.5 text-sm"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">IBAN / Account #</label>
                                    <input
                                        type="text"
                                        value={newMethod.accountNumber}
                                        onChange={(e) => setNewMethod({ ...newMethod, accountNumber: e.target.value })}
                                        placeholder="Account details"
                                        className="w-full bg-[#242424] border border-[#333] rounded-xl px-4 py-3.5 text-sm"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2 pt-2">
                                <input
                                    type="checkbox"
                                    id="isDefault"
                                    checked={newMethod.isDefault}
                                    onChange={(e) => setNewMethod({ ...newMethod, isDefault: e.target.checked })}
                                    className="bg-[#242424] border-[#333] text-indigo-500 rounded focus:ring-0"
                                />
                                <label htmlFor="isDefault" className="text-xs text-gray-400">Set as default payout method</label>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-indigo-500 hover:bg-indigo-600 py-3.5 rounded-xl font-bold transition-all mt-4"
                            >
                                Save Payout Method
                            </button>
                        </form>
                    </div>
                </div>
            )}
            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-[#1a1a1a] border border-[#2a2a2a] w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl text-center">
                        <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Trash2 size={32} />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Delete Card?</h2>
                        <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                            Are you sure you want to remove <span className="text-white font-bold">{methodToDelete?.type}</span> account ending in <span className="text-white font-mono">{methodToDelete?.accountNumber.slice(-4)}</span>?
                        </p>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={confirmDeleteMethod}
                                className="w-full bg-red-500 hover:bg-red-600 text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-red-500/10"
                            >
                                Yes, Delete Card
                            </button>
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="w-full bg-[#242424] hover:bg-[#2a2a2a] text-gray-400 py-4 rounded-2xl font-bold transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default WalletPage
