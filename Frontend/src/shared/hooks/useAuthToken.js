import { useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';

/**
 * Hook for consistent token access across the application
 * Handles both localStorage and AuthContext token access
 * @returns {string|null} JWT token or null if not available
 */
export const useAuthToken = () => {
  const { user } = useAuth();

  const token = useMemo(() => {
    if (typeof window === 'undefined') return null;
    
    // Try localStorage first (most reliable)
    const storedToken = localStorage.getItem('token');
    if (storedToken) return storedToken;
    
    // Fallback: check if user object has token (unlikely but possible)
    if (user?.token) return user.token;
    
    return null;
  }, [user]);

  return token;
};

export default useAuthToken;

