import React from 'react';
import { Clock, Mail } from 'lucide-react';

const MentorPendingApproval = () => {
    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
            <div className="bg-[#1a1a1a] border border-[#5D38DE]/30 rounded-2xl p-8 md:p-12 max-w-2xl w-full text-center">
                {/* Icon */}
                <div className="w-20 h-20 bg-[#5D38DE]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Clock className="w-10 h-10 text-[#5D38DE]" />
                </div>

                {/* Heading */}
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    Account Pending Approval
                </h1>

                {/* Message */}
                <p className="text-gray-300 text-lg mb-6">
                    Thank you for verifying your email! Your mentor account is currently under review by our admin team.
                </p>

                {/* Info boxes */}
                <div className="space-y-4 mb-8">
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-left">
                        <h3 className="text-white font-semibold mb-2 flex items-center">
                            <Mail className="w-5 h-5 mr-2 text-[#5D38DE]" />
                            What's Next?
                        </h3>
                        <p className="text-gray-400 text-sm">
                            You'll receive an email notification once your account has been approved. This typically takes 24-48 hours.
                        </p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-left">
                        <h3 className="text-white font-semibold mb-2">While You Wait</h3>
                        <ul className="text-gray-400 text-sm space-y-2">
                            <li>• Make sure your email inbox is checked regularly</li>
                            <li>• Prepare your mentor profile information</li>
                            <li>• Review our mentor guidelines and best practices</li>
                        </ul>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                        onClick={() => window.location.href = '/'}
                        className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg transition border border-white/10"
                    >
                        Return Home
                    </button>
                    <button
                        onClick={() => window.location.href = '/login'}
                        className="px-6 py-3 bg-[#5D38DE] hover:bg-[#5D38DE]/90 text-white rounded-lg transition"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MentorPendingApproval;
