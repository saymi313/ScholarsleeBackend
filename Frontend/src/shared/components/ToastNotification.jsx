import { useEffect, useState } from "react"
import { X, AlertCircle, CheckCircle2, AlertTriangle, Info } from "lucide-react"

const typeConfig = {
    error: {
        icon: AlertCircle,
        bg: "from-red-500/20 to-red-600/20",
        border: "border-red-500/30",
        iconBg: "bg-red-500/20",
        iconColor: "text-red-400",
        bar: "bg-red-500",
    },
    success: {
        icon: CheckCircle2,
        bg: "from-green-500/20 to-emerald-500/20",
        border: "border-green-500/30",
        iconBg: "bg-green-500/20",
        iconColor: "text-green-400",
        bar: "bg-green-500",
    },
    warning: {
        icon: AlertTriangle,
        bg: "from-amber-500/20 to-yellow-500/20",
        border: "border-amber-500/30",
        iconBg: "bg-amber-500/20",
        iconColor: "text-amber-400",
        bar: "bg-amber-500",
    },
    info: {
        icon: Info,
        bg: "from-blue-500/20 to-indigo-500/20",
        border: "border-blue-500/30",
        iconBg: "bg-blue-500/20",
        iconColor: "text-blue-400",
        bar: "bg-blue-500",
    },
}

const ToastNotification = ({ message, type = "info", onClose }) => {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        // Trigger slide-in
        requestAnimationFrame(() => setVisible(true))
    }, [])

    const handleClose = () => {
        setVisible(false)
        setTimeout(onClose, 200)
    }

    const config = typeConfig[type] || typeConfig.info
    const Icon = config.icon

    return (
        <div
            className={`pointer-events-auto transition-all duration-300 ease-out ${visible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
                }`}
        >
            <div
                className={`bg-gradient-to-r ${config.bg} border ${config.border} rounded-xl p-4 shadow-2xl backdrop-blur-md min-w-[300px] max-w-[420px]`}
            >
                <div className="flex items-start gap-3">
                    <div
                        className={`w-9 h-9 ${config.iconBg} rounded-full flex items-center justify-center flex-shrink-0 mt-0.5`}
                    >
                        <Icon className={`w-5 h-5 ${config.iconColor}`} />
                    </div>
                    <p className="text-white text-sm font-medium flex-1 leading-relaxed pt-1.5">
                        {message}
                    </p>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-white transition-colors flex-shrink-0 mt-0.5"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ToastNotification
