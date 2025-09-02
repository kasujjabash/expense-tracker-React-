import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SignUpForm.css';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || password === '') {
      setError('Email and password are required');
      return;
    }
    // Check credentials
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.email === email && user.password === password) {
      setError('');
      navigate('/home');
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="signup-page-root">
      <div className="signup-card">
        <h2 className="signup-title">Login to Your Account</h2>
        <form className="signup-form" onSubmit={handleSubmit}>
          <label className="signup-label">
            Email Address
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
              className="signup-input"
              autoFocus
            />
          </label>
          <label className="signup-label">
            Password
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
              className="signup-input"
            />
          </label>
          {error && <div className="signup-error">{error}</div>}
          <button type="submit" className="signup-btn">Login</button>
        </form>
        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '1rem' }}>
          Don't have an account?{' '}
          <a href="/signup" style={{ color: '#08702b', fontWeight: 600, textDecoration: 'none' }}>Sign Up</a>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;