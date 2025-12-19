import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Loader2, CheckCircle } from 'lucide-react';

const VerifyEmail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { verifyEmail, resendVerificationEmail } = useAuth();

    const email = location.state?.email || '';
    const role = location.state?.role || 'mentee';

    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Redirect if no email provided
    useEffect(() => {
        if (!email) {
            navigate('/signup');
        }
    }, [email, navigate]);

    // Handle OTP input
    const handleChange = (index, value) => {
        // Only allow numbers
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        setError('');

        // Auto-focus next input
        if (value && index < 5) {
            document.getElementById(`otp-${index + 1}`)?.focus();
        }
    };

    // Handle backspace
    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            document.getElementById(`otp-${index - 1}`)?.focus();
        }
    };

    // Handle paste
    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 6);
        const newOtp = pastedData.split('').concat(Array(6).fill('')).slice(0, 6);
        setOtp(newOtp);
    };

    // Handle submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        const otpCode = otp.join('');

        if (otpCode.length !== 6) {
            setError('Please enter the complete 6-digit code');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await verifyEmail(email, otpCode);

            if (response.success) {
                setSuccess(true);

                // Redirect after a short delay
                setTimeout(() => {
                    if (role === 'mentor') {
                        // Mentors go to pending approval page
                        navigate('/mentor-pending-approval');
                    } else {
                        // Mentees go to home/dashboard
                        navigate('/home');
                    }
                }, 1500);
            } else {
                setError(response.error || 'Invalid verification code');
            }
        } catch (err) {
            setError('Failed to verify email. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Handle resend OTP
    const handleResend = async () => {
        setResending(true);
        setError('');

        try {
            const response = await resendVerificationEmail(email);

            if (response.success) {
                alert('A new verification code has been sent to your email');
                setOtp(['', '', '', '', '', '']);
            } else {
                setError(response.error || 'Failed to resend code');
            }
        } catch (err) {
            setError('Failed to resend code. Please try again.');
        } finally {
            setResending(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
                <div className="bg-[#1a1a1a] border border-green-500/30 rounded-2xl p-8 max-w-md w-full text-center">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">Email Verified!</h2>
                    <p className="text-gray-400">
                        {role === 'mentor'
                            ? 'Your email has been verified. Your account is now pending admin approval.'
                            : 'Your email has been verified successfully. Redirecting...'}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
            <div className="bg-[#1a1a1a] border border-[#5D38DE] rounded-2xl p-8 max-w-md w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-[#5D38DE]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Mail className="w-8 h-8 text-[#5D38DE]" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">Verify Your Email</h2>
                    <p className="text-gray-400 text-sm">
                        We've sent a 6-digit code to<br />
                        <span className="text-white font-medium">{email}</span>
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* OTP Input */}
                    <div>
                        <label className="block text-gray-300 text-sm font-medium mb-3 text-center">
                            Enter Verification Code
                        </label>
                        <div className="flex gap-2 justify-center" onPaste={handlePaste}>
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    id={`otp-${index}`}
                                    type="text"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    className="w-12 h-14 text-center text-2xl font-bold bg-white/5 border border-white/10 rounded-lg text-white focus:border-[#5D38DE] focus:ring-2 focus:ring-[#5D38DE]/20 outline-none transition"
                                />
                            ))}
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="text-red-500 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-center">
                            {error}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading || otp.some(d => !d)}
                        className={`w-full py-3 rounded-lg font-semibold transition-all ${loading || otp.some(d => !d)
                                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                : 'bg-[#5D38DE] hover:bg-[#5D38DE]/90 text-white'
                            }`}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                Verifying...
                            </span>
                        ) : (
                            'Verify Email'
                        )}
                    </button>

                    {/* Resend Code */}
                    <div className="text-center pt-2">
                        <button
                            type="button"
                            onClick={handleResend}
                            disabled={resending}
                            className="text-[#5D38DE] hover:underline text-sm font-medium disabled:opacity-50"
                        >
                            {resending ? 'Sending...' : 'Resend Code'}
                        </button>
                    </div>
                </form>

                {/* Back to Signup */}
                <div className="text-center mt-6 pt-6 border-t border-white/10">
                    <button
                        onClick={() => navigate('/signup')}
                        className="text-gray-400 hover:text-white text-sm transition"
                    >
                        ← Back to Signup
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;
