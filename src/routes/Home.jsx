

import React, { useState } from 'react';
import AddAccountForm from '../components/AddAccountForm';
import AddTransactionForm from '../components/AddTransactionForm';
import './Home.css';

const Home = () => {
  const [showAccount, setShowAccount] = useState(false);
  const [showTransaction, setShowTransaction] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const handleAddAccount = (acc) => setAccounts([...accounts, acc]);
  const handleAddTransaction = (tx) => setTransactions([...transactions, tx]);

  return (
    <div className="home-root">
      <h2 className="home-title">Home</h2>
      <div className="home-card-area home-card-center">
        <button className="home-action-btn" onClick={() => setShowAccount(true)}>
          Add Account
        </button>
        <button className="home-action-btn" onClick={() => setShowTransaction(true)}>
          Add Transactions
        </button>
      </div>
      {showAccount && (
        <AddAccountForm onClose={() => setShowAccount(false)} onAdd={handleAddAccount} />
      )}
      {showTransaction && (
        <AddTransactionForm onClose={() => setShowTransaction(false)} onAdd={handleAddTransaction} accounts={accounts} />
      )}
      <div className="home-list-area">
        <h4>Accounts</h4>
        <ul>
          {accounts.length === 0 && <li>No accounts yet.</li>}
          {accounts.map((a, i) => (
            <li key={i}>{a.name} ({a.type})</li>
          ))}
        </ul>
        <h4>Transactions</h4>
        <ul>
          {transactions.length === 0 && <li>No transactions yet.</li>}
          {transactions.map((t, i) => (
            <li key={i}>{t.desc} - {t.amount} ({t.type}) {t.account && `- ${t.account}`}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Home;
