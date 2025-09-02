
import React, { useState } from 'react';
import '../styles/SignUpForm.css';

const SignUpForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || password === '') {
      setError('Name, email and password are required');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    // Save to localStorage
    const userData = { name, email, password, image };
    localStorage.setItem('user', JSON.stringify(userData));
    setError('');
    setSuccess(true);
  };

  return (
    <div className="signup-page-root">
      <div className="signup-card">
        <h2 className="signup-title">Create Your Account</h2>
        <form className="signup-form" onSubmit={handleSubmit}>
          <label className="signup-label">
            Name
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="signup-input"
              autoFocus
              placeholder="Enter your name"
            />
          </label>
          <label className="signup-label">
            Email Address
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="signup-input"
              placeholder="Enter your email"
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
              placeholder="Enter your password"
            />
          </label>
          <label className="signup-label">
            Confirm Password
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              className="signup-input"
              placeholder="Confirm your password"
            />
          </label>
          <label className="signup-label">
            Profile Image
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="signup-input"
            />
          </label>
          {image && (
            <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
              <img src={image} alt="Profile Preview" style={{ width: 64, height: 64, borderRadius: '50%' }} />
            </div>
          )}
          {error && <div className="signup-error">{error}</div>}
          {success && <div className="signup-success">Account created successfully!</div>}
          <button type="submit" className="signup-btn">Sign Up</button>
        </form>
        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '1rem' }}>
          Already have an account?{' '}
          <a href="/login" style={{ color: '#08702b', fontWeight: 600, textDecoration: 'none' }}>Login</a>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
