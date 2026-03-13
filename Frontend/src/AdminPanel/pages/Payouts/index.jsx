import { useEffect, useState } from "react"
import { adminPayoutsAPI } from "../../../utils/api"
import { useToast } from "../../../context/ToastContext"
import {
    History,
    CheckCircle2,
    XCircle,
    Clock,
    DollarSign,
    ExternalLink,
    ChevronLeft,
    ChevronRight,
    Upload,
    AlertTriangle,
    Info,
    X,
    Building2
} from "lucide-react"

const PayoutsManagement = () => {
    const { showError, showWarning } = useToast()
    const [payouts, setPayouts] = useState([])
    const [loading, setLoading] = useState(true)
    const [pagination, setPagination] = useState({ page: 1, pages: 1 })
    const [filter, setFilter] = useState("pending")

    // Modal state
    const [selectedPayout, setSelectedPayout] = useState(null)
    const [showProcessModal, setShowProcessModal] = useState(false)
    const [processData, setProcessData] = useState({
        receiptImage: "",
        adminNotes: ""
    })
    const [processing, setProcessing] = useState(false)
    const [showRejectConfirm, setShowRejectConfirm] = useState(false)

    useEffect(() => {
        fetchPayouts()
    }, [filter, pagination.page])

    const fetchPayouts = async () => {
        try {
            setLoading(true)
            const response = await adminPayoutsAPI.getRequests({
                status: filter === "all" ? "" : filter,
                page: pagination.page
            })
            if (response.data?.success) {
                setPayouts(response.data.data.payouts)
                setPagination(response.data.data.pagination)
            }
        } catch (err) {
            console.error("Failed to fetch payouts")
        } finally {
            setLoading(false)
        }
    }

    const handleCompletePayout = async (e) => {
        e.preventDefault()
        if (!selectedPayout) return

        setProcessing(true)
        try {
            const response = await adminPayoutsAPI.complete(selectedPayout._id, processData)
            if (response.data?.success) {
                setShowProcessModal(false)
                setSelectedPayout(null)
                setProcessData({ receiptImage: "", adminNotes: "" })
                fetchPayouts()
            }
        } catch (err) {
            showError("We couldn't complete this payout. Please try again.")
        } finally {
            setProcessing(false)
        }
    }

    const handleRejectPayout = () => {
        if (!selectedPayout || !processData.adminNotes) {
            showWarning("Please provide rejection reason in notes")
            return
        }
        setShowRejectConfirm(true)
    }

    const executeRejection = async () => {
        setProcessing(true)
        setShowRejectConfirm(false)
        try {
            const response = await adminPayoutsAPI.reject(selectedPayout._id, { adminNotes: processData.adminNotes })
            if (response.data?.success) {
                setShowProcessModal(false)
                setSelectedPayout(null)
                setProcessData({ receiptImage: "", adminNotes: "" })
                fetchPayouts()
            }
        } catch (err) {
            showError("We couldn't reject this payout. Please try again.")
        } finally {
            setProcessing(false)
        }
    }

    const renderStatus = (status) => {
        const config = {
            pending: { color: "bg-yellow-500/10 text-yellow-500", icon: Clock },
            completed: { color: "bg-green-500/10 text-green-500", icon: CheckCircle2 },
            rejected: { color: "bg-red-500/10 text-red-500", icon: XCircle },
        }
        const { color, icon: Icon } = config[status] || config.pending
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 w-max ${color}`}>
                <Icon size={12} />
                {status.toUpperCase()}
            </span>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <History className="text-[#5D38DE]" />
                        Payout Management
                    </h1>
                    <p className="text-gray-400 text-sm">Review and process manual withdrawal requests from mentors.</p>
                </div>

                <div className="flex bg-[#1a1a1a] p-1 rounded-lg border border-[#2a2a2a]">
                    {["pending", "completed", "rejected", "all"].map((s) => (
                        <button
                            key={s}
                            onClick={() => { setFilter(s); setPagination({ ...pagination, page: 1 }) }}
                            className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${filter === s ? "bg-[#5D38DE] text-white shadow-lg" : "text-gray-400 hover:text-white"
                                }`}
                        >
                            {s.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-[#242424] text-gray-400 uppercase text-[10px] tracking-widest font-bold">
                            <tr>
                                <th className="px-6 py-4">Mentor</th>
                                <th className="px-6 py-4">Method & Details</th>
                                <th className="px-6 py-4 text-right">Net Payout</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#2a2a2a]">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="6" className="px-6 py-6 bg-[#1a1a1a]/50"></td>
                                    </tr>
                                ))
                            ) : payouts.length > 0 ? (
                                payouts.map((p) => (
                                    <tr key={p._id} className="hover:bg-[#242424] transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-200">
                                                    {p.mentorId?.profile?.firstName} {p.mentorId?.profile?.lastName}
                                                </span>
                                                <span className="text-[10px] text-gray-500">{p.mentorId?.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-indigo-400">{p.payoutMethod.bankName}</span>
                                                <div className="flex items-center gap-1.5 mt-0.5">
                                                    <span className="text-[10px] text-gray-400 font-bold uppercase">{p.payoutMethod.country}</span>
                                                    <span className="text-[10px] text-gray-600">•</span>
                                                    <span className="text-[10px] text-gray-400">{p.payoutMethod.accountTitle}</span>
                                                </div>
                                                <span className="text-[10px] text-gray-500 font-mono italic mt-1">{p.payoutMethod.accountNumber}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end text-lg font-black text-white">
                                                <DollarSign size={14} className="text-[#5D38DE]" />
                                                {(p.netAmount || p.amount).toFixed(2)}
                                            </div>
                                            {p.platformFee > 0 && (
                                                <div className="text-[10px] text-gray-500 font-bold">
                                                    Fee: -${p.platformFee.toFixed(2)}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-gray-400 text-xs">
                                            {new Date(p.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            {renderStatus(p.status)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {p.status === "pending" ? (
                                                <button
                                                    onClick={() => { setSelectedPayout(p); setShowProcessModal(true) }}
                                                    className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg text-xs font-bold transition-all shadow-md shadow-indigo-500/10"
                                                >
                                                    Process
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => { setSelectedPayout(p); setShowProcessModal(true) }}
                                                    className="p-2 bg-[#2a2a2a] hover:bg-[#333] rounded-lg text-gray-400 hover:text-white transition-all"
                                                >
                                                    <Info size={16} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-20 text-center text-gray-500">
                                        No payout requests found for this filter.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                    <div className="p-4 bg-[#242424] flex items-center justify-between border-t border-[#2a2a2a]">
                        <p className="text-xs text-gray-500">Page {pagination.page} of {pagination.pages}</p>
                        <div className="flex gap-2">
                            <button
                                disabled={pagination.page === 1}
                                onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                                className="p-2 bg-[#1a1a1a] rounded disabled:opacity-30"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <button
                                disabled={pagination.page === pagination.pages}
                                onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                                className="p-2 bg-[#1a1a1a] rounded disabled:opacity-30"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Process Payout Modal - Deep Luxe Horizontal Redesign */}
            {showProcessModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300 font-poppins">
                    <div className="bg-[#0c0c0e] border border-white/5 w-full max-w-[85vw] rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] relative flex flex-col transition-all duration-500">
                        {/* Background Mesh Gradients */}
                        <div className="absolute top-[-20%] left-[-20%] w-[50%] h-[50%] bg-[#5D38DE]/10 blur-[120px] pointer-events-none" />
                        <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[50%] bg-indigo-500/10 blur-[120px] pointer-events-none" />

                        <div className="flex items-center justify-between px-8 py-6 border-b border-white/5 bg-[#0c0c0e]/80 backdrop-blur-md z-30">
                            <div>
                                <div className="flex items-center gap-3 mb-0.5">
                                    <div className="w-1.5 h-5 bg-gradient-to-b from-[#5D38DE] to-indigo-600 rounded-full" />
                                    <h2 className="text-2xl font-black text-white tracking-tight">
                                        {selectedPayout?.status === "pending" ? "Authorize Settlement" : "Execution Record"}
                                    </h2>
                                </div>
                                <p className="text-[11px] text-white/30 font-mono tracking-widest pl-4 uppercase">REF-ID: {selectedPayout?._id}</p>
                            </div>
                            <button
                                onClick={() => { setShowProcessModal(false); setSelectedPayout(null) }}
                                className="p-2.5 text-white/40 hover:text-white hover:bg-white/5 rounded-xl transition-all border border-white/5"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="flex flex-row relative z-10 h-full overflow-hidden">
                            {/* Left Side: Receipt & Financials (60%) */}
                            <div className="w-[60%] p-8 space-y-6 border-r border-white/5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Hero Amount */}
                                    <div className="p-6 bg-gradient-to-br from-[#1a1c2c] to-[#0f0c29] rounded-[2rem] border border-white/10 relative overflow-hidden group shadow-2xl">
                                        <div className="absolute inset-x-0 top-0 h-[0.5px] bg-gradient-to-r from-transparent via-[#5D38DE]/50 to-transparent" />
                                        <div className="relative z-10">
                                            <p className="text-[11px] font-black text-[#5D38DE] uppercase tracking-[0.2em] mb-3">Net Disbursement</p>
                                            <div className="flex items-baseline gap-1.5">
                                                <span className="text-xl font-black text-white/40">$</span>
                                                <h3 className="text-5xl font-black text-white tracking-tighter">
                                                    {(selectedPayout?.netAmount || selectedPayout?.amount)?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                </h3>
                                            </div>
                                            {(selectedPayout?.platformFee > 0) && (
                                                <div className="mt-4 pt-4 border-t border-white/5 space-y-1">
                                                    <div className="flex justify-between text-[10px]">
                                                        <span className="text-white/20 uppercase font-black">Gross Requested</span>
                                                        <span className="text-white/60 font-bold">${selectedPayout?.amount?.toFixed(2)}</span>
                                                    </div>
                                                    <div className="flex justify-between text-[10px]">
                                                        <span className="text-white/20 uppercase font-black">Platform Fee (20%)</span>
                                                        <span className="text-rose-500/80 font-bold">-${selectedPayout?.platformFee?.toFixed(2)}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="absolute -bottom-4 -right-4 opacity-[0.03]">
                                            <DollarSign size={100} className="text-white" />
                                        </div>
                                    </div>

                                    {/* Quick Recipient */}
                                    <div className="p-6 bg-white/[0.02] border border-white/5 rounded-[2rem] flex flex-col justify-center">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#5D38DE] to-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-lg">
                                                {selectedPayout?.mentorId?.profile?.firstName?.[0]}
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-black text-white/20 uppercase tracking-widest mb-0.5">Recipient</p>
                                                <p className="text-base font-black text-white truncate max-w-[150px]">
                                                    {selectedPayout?.mentorId?.profile?.firstName} {selectedPayout?.mentorId?.profile?.lastName}
                                                </p>
                                                <p className="text-xs text-white/40 truncate max-w-[150px]">{selectedPayout?.mentorId?.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Bank Ledger */}
                                <div className="p-6 bg-white/[0.01] border border-white/10 rounded-[2rem] relative">
                                    <h4 className="text-[11px] font-black text-white/40 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                                        <Building2 size={12} className="text-[#5D38DE]" />
                                        Settlement Destination
                                    </h4>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <p className="text-[10px] text-white/20 font-bold uppercase mb-0.5">Institution</p>
                                            <p className="text-sm font-black text-white">{selectedPayout?.payoutMethod.bankName}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-white/20 font-bold uppercase mb-0.5">Account Identification</p>
                                            <p className="text-sm font-mono text-indigo-400 font-bold">{selectedPayout?.payoutMethod.accountNumber}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-[10px] text-white/20 font-bold uppercase mb-0.5">Legal Beneficiary</p>
                                            <p className="text-sm font-bold text-white/80">{selectedPayout?.payoutMethod.accountTitle}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Status Timeline Placeholder or Small Info */}
                                <div className="flex items-center gap-4 px-6 py-4 bg-[#5D38DE]/5 border border-[#5D38DE]/10 rounded-2xl">
                                    <div className="w-8 h-8 rounded-full bg-[#5D38DE]/20 flex items-center justify-center text-[#5D38DE]">
                                        <Clock size={16} />
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-black text-white/40 uppercase tracking-widest">Requested on</p>
                                        <p className="text-sm font-bold text-white">{new Date(selectedPayout?.createdAt).toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Right Side: Action Console (40%) */}
                            <div className="w-[40%] bg-white/[0.01] p-8 flex flex-col justify-center border-l border-white/5">
                                {selectedPayout?.status === "pending" ? (
                                    <form onSubmit={handleCompletePayout} className="space-y-6">
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-[11px] font-black text-white/40 uppercase tracking-widest ml-1">Execution Proof (Receipt URL)</label>
                                                <div className="relative group">
                                                    <input
                                                        type="url"
                                                        value={processData.receiptImage}
                                                        onChange={(e) => setProcessData({ ...processData, receiptImage: e.target.value })}
                                                        placeholder="https://..."
                                                        className="w-full bg-white/[0.02] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:border-[#5D38DE] focus:bg-white/[0.04] outline-none transition-all placeholder:text-white/20"
                                                        required
                                                    />
                                                    <Upload size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#5D38DE] transition-colors" />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[11px] font-black text-white/40 uppercase tracking-widest ml-1">Internal Audit Notes</label>
                                                <textarea
                                                    value={processData.adminNotes}
                                                    onChange={(e) => setProcessData({ ...processData, adminNotes: e.target.value })}
                                                    placeholder="Reason or reference..."
                                                    className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[#5D38DE] focus:bg-white/[0.04] outline-none transition-all h-24 resize-none placeholder:text-white/20"
                                                ></textarea>
                                            </div>
                                        </div>

                                        <div className="space-y-3 pt-4">
                                            <button
                                                type="submit"
                                                disabled={processing || !processData.receiptImage}
                                                className="w-full bg-gradient-to-r from-[#5D38DE] to-indigo-600 hover:from-indigo-500 hover:to-[#5D38DE] text-white py-4 rounded-xl text-sm font-black uppercase tracking-[0.2em] transition-all disabled:opacity-20 shadow-lg shadow-[#5D38DE]/20 flex items-center justify-center gap-3"
                                            >
                                                {processing ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Finalize Transfer <CheckCircle2 size={16} /></>}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleRejectPayout}
                                                disabled={processing || !processData.adminNotes}
                                                className="w-full py-4 bg-white/5 border border-white/5 text-white/40 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl text-xs font-black uppercase tracking-widest transition-all disabled:opacity-5 flex items-center justify-center gap-2"
                                            >
                                                <XCircle size={14} /> Void Settlement
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="p-5 bg-emerald-500/5 rounded-[2rem] border border-emerald-500/20 text-center relative overflow-hidden">
                                            <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500" />
                                            <p className="text-xs font-black text-emerald-400 uppercase tracking-[0.3em] mb-2">Executed Successfully</p>
                                            <p className="text-[11px] text-white/40 leading-tight">This transaction has been verified and settled by the central treasury.</p>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="p-4 bg-white/[0.02] rounded-2xl border border-white/5">
                                                <p className="text-[10px] font-black text-white/20 uppercase mb-1">Authenticated By</p>
                                                <p className="text-sm font-bold text-white">ADMIN-{selectedPayout?.processedBy?.slice(-4)}</p>
                                            </div>

                                            {selectedPayout?.receiptImage && (
                                                <a
                                                    href={selectedPayout.receiptImage}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-between p-4 bg-[#5D38DE]/5 rounded-2xl border border-[#5D38DE]/20 hover:bg-[#5D38DE]/10 transition-all group"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <ExternalLink size={16} className="text-[#5D38DE]" />
                                                        <span className="text-xs font-black text-white uppercase tracking-widest">Digital Proof</span>
                                                    </div>
                                                    <div className="text-[10px] font-black text-[#5D38DE] uppercase border border-[#5D38DE]/30 px-2 py-1 rounded">View</div>
                                                </a>
                                            )}

                                            {selectedPayout?.adminNotes && (
                                                <div className="p-4 bg-yellow-500/5 border border-yellow-500/10 rounded-2xl">
                                                    <p className="text-[10px] font-black text-yellow-500/60 uppercase mb-1 flex items-center gap-1.5">
                                                        <AlertTriangle size={10} /> Record Note
                                                    </p>
                                                    <p className="text-sm text-gray-400 italic font-medium leading-relaxed">"{selectedPayout.adminNotes}"</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Rejection Confirmation Modal */}
            {showRejectConfirm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 font-poppins">
                    <div className="bg-[#0c0c0e] border border-rose-500/20 w-full max-w-md rounded-[2rem] overflow-hidden shadow-[0_0_50px_rgba(244,63,94,0.1)] relative">
                        <div className="p-8 text-center space-y-6">
                            <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto border border-rose-500/20">
                                <AlertTriangle size={32} className="text-rose-500" />
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-xl font-black text-white">Void Settlement?</h3>
                                <p className="text-sm text-gray-400 leading-relaxed px-4">
                                    Are you sure you want to reject this payout of <span className="text-white font-bold">${selectedPayout?.amount}</span>?
                                    The funds will be instantly refunded to the mentor's wallet.
                                </p>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => setShowRejectConfirm(false)}
                                    className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={executeRejection}
                                    className="flex-1 py-4 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-rose-500/20"
                                >
                                    Confirm Void
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default PayoutsManagement
