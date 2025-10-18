import React from 'react';
import '../styles/Landing.css';


const Index = () => (
  <div className="landing-root">
    <header className="landing-header">
  <div className="landing-logo">Vault Path <span style={{fontWeight:400}}>| Expense Tracker</span></div>
      <div className="landing-header-actions">
        <a href="/login" className="landing-header-btn">Login</a>
        <a href="/signup" className="landing-header-btn primary">Create Account</a>
      </div>
    </header>
    <div className="landing-hero">
      <div className="landing-content">
        <h1 className="landing-title">Welcome to Vault Path</h1>
        <p className="landing-desc" style={{fontStyle:'italic',fontWeight:500}}>
          See where your money goes.
        </p>
        <p className="landing-desc" style={{marginTop: '1rem', fontWeight: 400, color: '#e6ffe6'}}>
          Vault Path is your personal finance companion. Effortlessly track expenses and income, manage all your accounts in one place, and gain insights into your spending habits. With a modern, intuitive interface and real-time data sync, you can take control of your financial journey—anytime, anywhere.
        </p>
  <a href="/signup" className="landing-btn">Get Started</a>
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
    
    {/* Features Section */}
    <div className="landing-features-section">
      <h2 className="section-title">Features That Make a Difference</h2>
      <div className="landing-features">
        <div className="feature-card">
          <div className="feature-icon">📊</div>
          <h3>Easy Tracking</h3>
          <p>Log your expenses and income in seconds with a clean, intuitive interface.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🏦</div>
          <h3>Account Management</h3>
          <p>Organize all your accounts in one place and monitor your balances easily.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📈</div>
          <h3>Insightful Reports</h3>
          <p>Visualize your spending and income trends with beautiful, simple reports.</p>
        </div>
      </div>
    </div>

    {/* How Vault Path Works Section */}
    <div className="landing-how-it-works">
      <h2 className="section-title">How Vault Path Works</h2>
      <div className="steps-container">
        <div className="step-card">
          <div className="step-number">1</div>
          <h3>Create Your Account</h3>
          <p>Sign up in seconds and set up your profile with your financial goals in mind.</p>
        </div>
        <div className="step-card">
          <div className="step-number">2</div>
          <h3>Add Your Accounts</h3>
          <p>Connect all your bank accounts, credit cards, and cash accounts in one secure place.</p>
        </div>
        <div className="step-card">
          <div className="step-number">3</div>
          <h3>Track Transactions</h3>
          <p>Log expenses and income effortlessly with smart categorization and quick entry.</p>
        </div>
        <div className="step-card">
          <div className="step-number">4</div>
          <h3>Get Insights</h3>
          <p>View detailed reports and charts to understand your spending patterns and make better decisions.</p>
        </div>
      </div>
    </div>

    {/* Partners Section */}
    <div className="landing-partners">
      <h2 className="section-title">Trusted by Leading Financial Institutions</h2>
      <div className="partners-grid">
        <div className="partner-logo">
          <div className="partner-name">SecureBank</div>
        </div>
        <div className="partner-logo">
          <div className="partner-name">FinTech Pro</div>
        </div>
        <div className="partner-logo">
          <div className="partner-name">CryptoWallet</div>
        </div>
        <div className="partner-logo">
          <div className="partner-name">PayStream</div>
        </div>
        <div className="partner-logo">
          <div className="partner-name">BankSync</div>
        </div>
        <div className="partner-logo">
          <div className="partner-name">MoneyFlow</div>
        </div>
      </div>
    </div>

    {/* Testimonials Section */}
    <div className="landing-testimonials">
      <h2 className="section-title">Highly Rated & Easy to Use</h2>
      <div className="testimonials-list">
        <div className="testimonial-card">
          <div className="testimonial-quote">
            "Vault Path has completely transformed how I manage my finances. The interface is so intuitive, and I love seeing all my accounts in one place!"
          </div>
          <div className="testimonial-user">- Sarah M.</div>
          <div className="testimonial-rating">⭐⭐⭐⭐⭐</div>
        </div>
        <div className="testimonial-card">
          <div className="testimonial-quote">
            "Finally, an expense tracker that doesn't overwhelm me with features I don't need. Clean, simple, and powerful."
          </div>
          <div className="testimonial-user">- James K.</div>
          <div className="testimonial-rating">⭐⭐⭐⭐⭐</div>
        </div>
        <div className="testimonial-card">
          <div className="testimonial-quote">
            "The reports feature helped me identify where I was overspending. I've saved $500 this month alone!"
          </div>
          <div className="testimonial-user">- Maria L.</div>
          <div className="testimonial-rating">⭐⭐⭐⭐⭐</div>
        </div>
      </div>
    </div>

    {/* Footer */}
    <footer className="landing-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Vault Path</h3>
          <p>Your personal finance companion for smarter money management.</p>
        </div>
        <div className="footer-section">
          <h4>Product</h4>
          <ul>
            <li><a href="#features">Features</a></li>
            <li><a href="#pricing">Pricing</a></li>
            <li><a href="#security">Security</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Company</h4>
          <ul>
            <li><a href="#about">About Us</a></li>
            <li><a href="#contact">Contact</a></li>
            <li><a href="#careers">Careers</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Support</h4>
          <ul>
            <li><a href="#help">Help Center</a></li>
            <li><a href="#privacy">Privacy Policy</a></li>
            <li><a href="#terms">Terms of Service</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 Vault Path. All rights reserved.</p>
        <div className="footer-social">
          <a href="#twitter">Twitter</a>
          <a href="#linkedin">LinkedIn</a>
          <a href="#facebook">Facebook</a>
        </div>
      </div>
    </footer>
  </div>
);

export default Index;
