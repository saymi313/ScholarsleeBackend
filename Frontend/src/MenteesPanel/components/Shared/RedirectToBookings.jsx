import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RedirectToBookings = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/mentees/bookings', { replace: true });
  }, [navigate]);

  return null;
};

export default RedirectToBookings;
