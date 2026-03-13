"use client"

import React, { useState } from "react"
import DataTable from "../../components/DataTable"
import { useAdminStore } from "../../state/AdminStore"
import ConfirmationModal from "../../components/ConfirmationModal"

const PERMISSION_OPTIONS = [
    "Dashboard",
    "Users",
    "Mentors",
    "Services",
    "Sessions",
    "Reviews",
    "Payments",
    "Payouts",
    "Notifications",
    "Settings",
    "Admins & Roles", // Careful with this one
    "Logs"
]

export default function AdminsPage() {
    const { state, actions } = useAdminStore()
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [adminToDelete, setAdminToDelete] = useState(null)
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        permissions: []
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const columns = [
        {
            key: "name",
            header: "Name",
            render: (_, r) => r.name || `${r.profile?.firstName || ''} ${r.profile?.lastName || ''}`.trim() || 'Admin'
        },
        { key: "email", header: "Email" },
        { key: "role", header: "Role" },
        {
            key: "status",
            header: "Status",
            render: (_, r) => (
                <span className={`px-2 py-1 rounded text-xs ${r.isActive ? 'bg-green-500/15 text-green-300' : 'bg-red-500/15 text-red-300'}`}>
                    {r.isActive ? 'Active' : 'Disabled'}
                </span>
            )
        },
        {
            key: "actions",
            header: "Actions",
            render: (_, r) => (
                <div className="flex gap-2">
                    {/* <button className="px-2 py-1 rounded bg-white/5 text-xs">Edit</button> */}
                    <button
                        onClick={() => actions.setAdminStatus(r._id || r.id, r.isActive ? 'disabled' : 'active')}
                        className={`px-2 py-1 rounded text-xs ${r.isActive ? 'bg-rose-500/15 text-rose-300' : 'bg-green-500/15 text-green-300'}`}
                    >
                        {r.isActive ? 'Disable' : 'Enable'}
                    </button>
                    <button
                        onClick={() => setAdminToDelete(r)}
                        className="px-2 py-1 rounded bg-red-500/15 text-red-300 text-xs"
                    >
                        Delete
                    </button>
                </div>
            ),
        },
    ]

    const rows = state.admins || []

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handlePermissionToggle = (permission) => {
        setFormData(prev => {
            const current = prev.permissions
            if (current.includes(permission)) {
                return { ...prev, permissions: current.filter(p => p !== permission) }
            } else {
                return { ...prev, permissions: [...current, permission] }
            }
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const result = await actions.createAdmin(formData)
        setLoading(false)

        if (result.success) {
            setIsCreateModalOpen(false)
            setFormData({ firstName: "", lastName: "", email: "", password: "", permissions: [] })
        } else {
            setError(result.error)
        }
    }

    const toggleSelectAll = () => {
        if (formData.permissions.length === PERMISSION_OPTIONS.length) {
            setFormData(prev => ({ ...prev, permissions: [] }))
        } else {
            setFormData(prev => ({ ...prev, permissions: [...PERMISSION_OPTIONS] }))
        }
    }

    const handleConfirmDelete = async () => {
        if (adminToDelete) {
            await actions.deleteAdmin(adminToDelete._id || adminToDelete.id)
            setAdminToDelete(null)
        }
    }

    return (
        <section className="px-4 md:px-8 pb-10 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white">Admins & Roles</h1>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                    + Create Admin
                </button>
            </div>

            <DataTable title="Admin Users" columns={columns} rows={rows} />

            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    {/* Backdrop */}
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={() => setIsCreateModalOpen(false)} />

                    {/* Modal Panel Container */}
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <div className="relative transform overflow-hidden rounded-xl bg-[#1A1A1C] border border-white/10 text-left shadow-2xl transition-all sm:my-8 w-full max-w-2xl">
                            <div className="p-6 border-b border-white/10 flex justify-between items-center">
                                <h2 className="text-xl font-semibold text-white">Create New Admin</h2>
                                <button onClick={() => setIsCreateModalOpen(false)} className="text-gray-400 hover:text-white">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                {error && (
                                    <div className="p-3 bg-red-500/20 border border-red-500/30 text-red-200 rounded-lg text-sm">
                                        {error}
                                    </div>
                                )}

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">First Name</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            required
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Last Name</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        required
                                        minLength={6}
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                                        placeholder="Min 6 characters"
                                    />
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="block text-sm font-medium text-gray-300">Access Permissions</label>
                                        <button type="button" onClick={toggleSelectAll} className="text-xs text-blue-400 hover:text-blue-300">
                                            {formData.permissions.length === PERMISSION_OPTIONS.length ? 'Deselect All' : 'Select All'}
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 bg-black/20 p-4 rounded-lg border border-white/5 gap-3 max-h-60 overflow-y-auto">
                                        {PERMISSION_OPTIONS.map(option => (
                                            <label key={option} className="flex items-center space-x-2 cursor-pointer group">
                                                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${formData.permissions.includes(option) ? 'bg-blue-600 border-blue-600' : 'border-gray-500 group-hover:border-gray-400'}`}>
                                                    {formData.permissions.includes(option) && (
                                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                                    )}
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    className="hidden"
                                                    checked={formData.permissions.includes(option)}
                                                    onChange={() => handlePermissionToggle(option)}
                                                />
                                                <span className={`text-sm ${formData.permissions.includes(option) ? 'text-white' : 'text-gray-400'}`}>{option}</span>
                                            </label>
                                        ))}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Select the tabs this admin can access.</p>
                                </div>

                                <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                                    <button
                                        type="button"
                                        onClick={() => setIsCreateModalOpen(false)}
                                        className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading && <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                                        Create Admin
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={!!adminToDelete}
                onClose={() => setAdminToDelete(null)}
                onConfirm={handleConfirmDelete}
                title="Delete Admin"
                message={`Are you sure you want to delete ${adminToDelete?.name || adminToDelete?.email}? This action cannot be undone.`}
                confirmText="Delete Admin"
                isDanger={true}
            />
        </section>
    )
}
