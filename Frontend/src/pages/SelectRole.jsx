import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, GraduationCap, Loader2 } from 'lucide-react';
import api from '../utils/api';

const SelectRole = () => {
    const [selectedRole, setSelectedRole] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async () => {
        if (!selectedRole) {
            setError('Please select a role');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await api.post('/users/select-role', { role: selectedRole });

            if (response.data.success) {
                // Update token with new role
                localStorage.setItem('token', response.data.data.token);

                // Update user info
                localStorage.setItem('user', JSON.stringify(response.data.data.user));

                // Redirect based on role
                if (selectedRole === 'mentor') {
                    navigate('/mentor/dashboard');
                } else {
                    navigate('/mentees/profile');
                }
            } else {
                setError(response.data.message || 'Failed to select role');
            }
        } catch (err) {
            console.error('Error selecting role:', err);
            setError('Failed to select role. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
            <div className="max-w-4xl w-full">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-white mb-4">Choose Your Role</h1>
                    <p className="text-gray-400 text-lg">
                        Select how you'd like to participate in Scholarslee
                    </p>
                </div>

                {/* Role Cards */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    {/* Mentee Card */}
                    <button
                        onClick={() => setSelectedRole('mentee')}
                        className={`p-8 rounded-2xl border-2 transition-all duration-300 text-left ${selectedRole === 'mentee'
                            ? 'border-[#5D38DE] bg-[#5D38DE]/10 shadow-lg shadow-[#5D38DE]/20'
                            : 'border-gray-700 bg-[#1a1a1a] hover:border-gray-600'
                            }`}
                    >
                        <div className="flex items-center mb-4">
                            <div
                                className={`w-16 h-16 rounded-full flex items-center justify-center ${selectedRole === 'mentee' ? 'bg-[#5D38DE]' : 'bg-gray-700'
                                    }`}
                            >
                                <GraduationCap className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-white ml-4">I'm a Mentee</h2>
                        </div>
                        <p className="text-gray-400 mb-6">
                            Looking for guidance, mentorship, and support to grow in my career or academic journey.
                        </p>
                        <ul className="space-y-2 text-gray-300">
                            <li className="flex items-start">
                                <span className="text-[#5D38DE] mr-2">✓</span>
                                Connect with experienced mentors
                            </li>
                            <li className="flex items-start">
                                <span className="text-[#5D38DE] mr-2">✓</span>
                                Get personalized guidance
                            </li>
                            <li className="flex items-start">
                                <span className="text-[#5D38DE] mr-2">✓</span>
                                Learn from experts in your field
                            </li>
                        </ul>
                    </button>

                    {/* Mentor Card */}
                    <button
                        onClick={() => setSelectedRole('mentor')}
                        className={`p-8 rounded-2xl border-2 transition-all duration-300 text-left ${selectedRole === 'mentor'
                            ? 'border-[#5D38DE] bg-[#5D38DE]/10 shadow-lg shadow-[#5D38DE]/20'
                            : 'border-gray-700 bg-[#1a1a1a] hover:border-gray-600'
                            }`}
                    >
                        <div className="flex items-center mb-4">
                            <div
                                className={`w-16 h-16 rounded-full flex items-center justify-center ${selectedRole === 'mentor' ? 'bg-[#5D38DE]' : 'bg-gray-700'
                                    }`}
                            >
                                <Users className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-white ml-4">I'm a Mentor</h2>
                        </div>
                        <p className="text-gray-400 mb-6">
                            Ready to share my knowledge, experience, and help others achieve their goals.
                        </p>
                        <ul className="space-y-2 text-gray-300">
                            <li className="flex items-start">
                                <span className="text-[#5D38DE] mr-2">✓</span>
                                Share your expertise
                            </li>
                            <li className="flex items-start">
                                <span className="text-[#5D38DE] mr-2">✓</span>
                                Build your personal brand
                            </li>
                            <li className="flex items-start">
                                <span className="text-[#5D38DE] mr-2">✓</span>
                                Make a difference in others' lives
                            </li>
                        </ul>
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-center">
                        {error}
                    </div>
                )}

                {/* Continue Button */}
                <div className="text-center">
                    <button
                        onClick={handleSubmit}
                        disabled={!selectedRole || loading}
                        className={`px-12 py-4 rounded-lg font-semibold text-lg transition-all ${selectedRole && !loading
                            ? 'bg-[#5D38DE] hover:bg-[#5D38DE]/90 text-white shadow-lg shadow-[#5D38DE]/30'
                            : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        {loading ? (
                            <span className="flex items-center">
                                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                Saving...
                            </span>
                        ) : (
                            'Continue'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SelectRole;
