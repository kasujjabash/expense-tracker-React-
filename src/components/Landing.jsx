import React from 'react';
import '../styles/Landing.css';


const Landing = () => (
  <div className="landing-root">
    <header className="landing-header">
  <div className="landing-logo">Vault Path <span style={{fontWeight:400}}>| Expense Tracker</span></div>
      <div className="landing-header-actions">
        <a href="#login" className="landing-header-btn">Login</a>
        <a href="#create-account" className="landing-header-btn primary">Create Account</a>
      </div>
    </header>
    <div className="landing-hero">
      <div className="landing-content">
        <h1 className="landing-title">Welcome to Vault Path</h1>
        <p className="landing-desc" style={{fontStyle:'italic',fontWeight:500}}>
          See where your money goes.
        </p>
        <p className="landing-desc" style={{marginTop: '1rem', fontWeight: 400, color: '#333'}}>
          Vault Path is your personal finance companion. Effortlessly track expenses and income, manage all your accounts in one place, and gain insights into your spending habits. With a modern, intuitive interface and real-time data sync, you can take control of your financial journey—anytime, anywhere.
        </p>
        <a href="/home" className="landing-btn">Get Started</a>
      </div>
      {/* <div className="landing-illustration">
        <svg width="180" height="180" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="90" cy="90" r="80" fill="#b2f5c8" />
          <rect x="50" y="70" width="80" height="40" rx="10" fill="#08702b" />
          <rect x="70" y="50" width="40" height="20" rx="6" fill="#0b8c36" />
          <rect x="70" y="120" width="40" height="20" rx="6" fill="#0b8c36" />
        </svg>
      </div> */}
    </div>
    <div className="landing-features">
      <div className="feature-card">
        <h3>Easy Tracking</h3>
        <p>Log your expenses and income in seconds with a clean, intuitive interface.</p>
      </div>
      <div className="feature-card">
        <h3>Account Management</h3>
        <p>Organize all your accounts in one place and monitor your balances easily.</p>
      </div>
      <div className="feature-card">
        <h3>Insightful Reports</h3>
        <p>Visualize your spending and income trends with beautiful, simple reports.</p>
      </div>
    </div>
  </div>
);

export default Landing;
