import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, User, ArrowRight } from 'lucide-react';

const ProfileSetupModal = ({ isOpen, onClose, role }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleCompleteProfile = () => {
    onClose();
    // Redirect to appropriate profile page based on role
    if (role === 'mentor') {
      navigate('/mentor/profile');
    } else if (role === 'admin') {
      navigate('/admin/settings');
    } else {
      navigate('/mentees/profile');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/20 bg-[#161619] shadow-2xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#5D38DE]/20">
                <User className="w-6 h-6 text-[#5D38DE]" />
              </div>
              <h3 className="text-xl font-bold text-white">Complete Your Profile</h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5 text-white/80" />
            </button>
          </div>

          <div className="space-y-4">
            <p className="text-white/70 text-sm">
              Welcome! To get started, please complete your profile by adding your contact information and preferences.
            </p>

            <div className="bg-white/5 rounded-lg p-4 space-y-2">
              <p className="text-sm font-medium text-white">You'll need to provide:</p>
              <ul className="text-sm text-white/70 space-y-1 ml-4 list-disc">
                <li>Phone number</li>
                <li>Country</li>
                <li>Timezone</li>
                {role === 'mentor' && <li>Professional details</li>}
              </ul>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleCompleteProfile}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#5D38DE] hover:bg-[#4d2fc7] text-white font-medium transition-colors"
              >
                Complete Profile
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 font-medium transition-colors"
              >
                Later
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetupModal;

