import React, { useState, useEffect } from 'react'
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react'

const Notification = ({
  type = 'success',
  message,
  isVisible,
  onClose,
  duration = 3000,
  position = 'fixed'
}) => {
  const [show, setShow] = useState(isVisible)

  useEffect(() => {
    setShow(isVisible)
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        setShow(false)
        onClose?.()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, onClose])

  if (!show) return null

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />
      case 'error':
        return <XCircle className="w-5 h-5 text-red-400" />
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-400" />
      case 'info':
        return <Info className="w-5 h-5 text-blue-400" />
      default:
        return <CheckCircle className="w-5 h-5 text-green-400" />
    }
  }

  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-600/20 border-green-600 text-green-400'
      case 'error':
        return 'bg-red-600/20 border-red-600 text-red-400'
      case 'warning':
        return 'bg-yellow-600/20 border-yellow-600 text-yellow-400'
      case 'info':
        return 'bg-blue-600/20 border-blue-600 text-blue-400'
      default:
        return 'bg-green-600/20 border-green-600 text-green-400'
    }
  }

  const positionClasses = position === 'fixed'
    ? 'fixed top-4 right-4 z-50'
    : 'absolute top-4 right-4 z-50'

  return (
    <div className={`${positionClasses} max-w-sm w-full bg-[#1a1a1a] border rounded-lg p-4 shadow-lg transform transition-all duration-300 ${show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      } ${getStyles()}`}>
      <div className="flex items-start gap-3">
        {getIcon()}
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button
          onClick={() => {
            setShow(false)
            onClose?.()
          }}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <XCircle className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default Notification
