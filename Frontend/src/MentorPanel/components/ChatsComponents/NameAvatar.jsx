import React from "react"

/**
 * Renders a profile avatar image when available,
 * or a coloured circle with the user's initials when not.
 */

const COLORS = [
    "#5D38DE", "#E74C3C", "#3498DB", "#2ECC71",
    "#F39C12", "#9B59B6", "#1ABC9C", "#E67E22",
    "#34495E", "#16A085",
]

function getColor(name = "") {
    let hash = 0
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash)
    }
    return COLORS[Math.abs(hash) % COLORS.length]
}

function getInitials(name = "") {
    const parts = name.trim().split(/\s+/)
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    if (parts.length === 1 && parts[0]) return parts[0][0].toUpperCase()
    return "?"
}

export default function NameAvatar({ src, name, size = "w-10 h-10", className = "", textSize = "text-sm" }) {
    if (src) {
        return (
            <img
                src={src}
                alt={name || ""}
                className={`${size} rounded-full object-cover ${className}`}
            />
        )
    }

    return (
        <div
            className={`${size} rounded-full flex items-center justify-center font-semibold text-white ${textSize} ${className}`}
            style={{ backgroundColor: getColor(name) }}
            title={name}
        >
            {getInitials(name)}
        </div>
    )
}
