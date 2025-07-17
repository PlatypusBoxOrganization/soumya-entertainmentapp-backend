import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await authAPI.logout();
        navigate('/login');
      } catch (error) {
        console.error('Logout error:', error);
      }
    };

    performLogout();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-900">
      <div className="text-white text-lg">Logging out...</div>
    </div>
  );
};

export default Logout;
