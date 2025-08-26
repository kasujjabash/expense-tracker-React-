
import React, { useState, useEffect } from 'react';
import '../styles/Transfer.css';

const ACCOUNTS_KEY = 'expense-tracker-accounts';

const Transfer = () => {
  const [accounts, setAccounts] = useState([]);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem(ACCOUNTS_KEY);
    setAccounts(stored ? JSON.parse(stored) : []);
  }, []);

  const handleTransfer = (e) => {
    e.preventDefault();
    if (!from || !to || !amount || from === to) {
      setMessage('Please select different accounts and enter an amount.');
      return;
    }
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) {
      setMessage('Enter a valid amount.');
      return;
    }
    const fromIdx = accounts.findIndex(a => a.name === from);
    const toIdx = accounts.findIndex(a => a.name === to);
    if (fromIdx === -1 || toIdx === -1) {
      setMessage('Account not found.');
      return;
    }
    if (parseFloat(accounts[fromIdx].amount) < amt) {
      setMessage('Insufficient funds in source account.');
      return;
    }
    const newAccounts = accounts.map((acc, i) => {
      if (i === fromIdx) return { ...acc, amount: (parseFloat(acc.amount) - amt).toFixed(2) };
      if (i === toIdx) return { ...acc, amount: (parseFloat(acc.amount) + amt).toFixed(2) };
      return acc;
    });
    setAccounts(newAccounts);
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(newAccounts));
    setMessage(`Transferred $${amt.toFixed(2)} from ${from} to ${to}.`);
    setAmount('');
  };

  return (
    <div className="transfer-form-container">
      <h2>Transfer</h2>
      <form onSubmit={handleTransfer}>
        <label>From Account
          <select value={from} onChange={e => setFrom(e.target.value)} required>
            <option value="">Select</option>
            {accounts.map(acc => <option key={acc.name} value={acc.name}>{acc.name}</option>)}
          </select>
        </label>
        <label>To Account
          <select value={to} onChange={e => setTo(e.target.value)} required>
            <option value="">Select</option>
            {accounts.map(acc => <option key={acc.name} value={acc.name}>{acc.name}</option>)}
          </select>
        </label>
        <label>Amount
          <input type="number" min="0.01" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} required />
        </label>
        <button type="submit">Transfer</button>
      </form>
      {message && <div className="transfer-message" style={{ color: message.startsWith('Transferred') ? 'green' : 'red' }}>{message}</div>}
    </div>
  );
};

export default Transfer;
