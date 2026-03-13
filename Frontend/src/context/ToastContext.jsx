import { createContext, useContext, useState, useCallback } from "react"
import ToastNotification from "../shared/components/ToastNotification"

const ToastContext = createContext()

export const useToast = () => {
    const context = useContext(ToastContext)
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider")
    }
    return context
}

let toastId = 0

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([])

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
    }, [])

    const showToast = useCallback((message, type = "info", duration) => {
        const id = ++toastId
        const autoDismiss = duration || (type === "success" ? 3000 : type === "error" ? 5000 : 4000)

        setToasts((prev) => [...prev, { id, message, type }])

        setTimeout(() => removeToast(id), autoDismiss)

        return id
    }, [removeToast])

    const showError = useCallback((msg) => showToast(msg, "error"), [showToast])
    const showSuccess = useCallback((msg) => showToast(msg, "success"), [showToast])
    const showWarning = useCallback((msg) => showToast(msg, "warning"), [showToast])
    const showInfo = useCallback((msg) => showToast(msg, "info"), [showToast])

    return (
        <ToastContext.Provider value={{ showToast, showError, showSuccess, showWarning, showInfo }}>
            {children}
            <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none" style={{ maxWidth: "420px" }}>
                {toasts.map((toast) => (
                    <ToastNotification
                        key={toast.id}
                        message={toast.message}
                        type={toast.type}
                        onClose={() => removeToast(toast.id)}
                    />
                ))}
            </div>
        </ToastContext.Provider>
    )
}

export default ToastContext
