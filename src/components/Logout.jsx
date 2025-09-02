import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();
  useEffect(() => {
    // Remove user from localStorage
    localStorage.removeItem('user');
    // Redirect to login page
    navigate('/login', { replace: true });
  }, [navigate]);

  return (
    <div>
      <h2>Logout</h2>
      <p>You have been logged out.</p>
    </div>
  );
};

export default Logout;
