import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ProfileSetupModal from '../components/ProfileSetupModal';
import { Loader2 } from 'lucide-react';

const GoogleAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = searchParams.get('token');
    const role = searchParams.get('role');
    const needsRoleSelection = searchParams.get('needsRoleSelection') === 'true';
    const needsProfileSetup = searchParams.get('needsProfileSetup') === 'true';
    const error = searchParams.get('error');

    if (error) {
      // Handle error
      console.error('Google auth error:', error);
      navigate('/login?error=google_auth_failed');
      return;
    }

    if (token) {
      // Store token
      localStorage.setItem('token', token);

      // Store user info
      const user = {
        role: role,
        // You can decode the token to get more user info if needed
      };
      localStorage.setItem('user', JSON.stringify(user));

      setLoading(false);

      // Priority: Role selection > Profile setup > Dashboard
      if (needsRoleSelection) {
        navigate('/select-role');
      } else if (needsProfileSetup) {
        setShowProfileModal(true);
      } else {
        // Redirect based on role
        redirectToDashboard(role);
      }
    } else {
      setLoading(false);
      navigate('/login?error=no_token');
    }
  }, [searchParams, navigate]);

  const redirectToDashboard = (role) => {
    if (role === 'mentor') {
      navigate('/mentor/dashboard');
    } else if (role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/home');
    }
  };

  const handleProfileModalClose = () => {
    setShowProfileModal(false);
    const role = searchParams.get('role');
    redirectToDashboard(role);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#5D38DE] mx-auto mb-4" />
          <p className="text-white/70">Completing sign in...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ProfileSetupModal
        isOpen={showProfileModal}
        onClose={handleProfileModalClose}
        role={searchParams.get('role')}
      />
    </>
  );
};

export default GoogleAuthCallback;

