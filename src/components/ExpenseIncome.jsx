

import React, { useState, useEffect } from 'react';
import AddTransactionForm from '../components/AddTransactionForm';
import '../styles/ExpenseIncome.css';

const ACCOUNTS_KEY = 'expense-tracker-accounts';
const TRANSACTIONS_KEY = 'expense-tracker-transactions';

const ExpenseIncome = () => {
  const [showForm, setShowForm] = useState(null); // 'income' | 'expense' | null
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [txError, setTxError] = useState('');

  // Helper to save transactions to state and localStorage
  const saveTransactions = (newTxs) => {
    setTransactions(newTxs);
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(newTxs));
  };

  useEffect(() => {
    const load = () => {
      try {
        const storedAcc = localStorage.getItem(ACCOUNTS_KEY);
        if (storedAcc) setAccounts(JSON.parse(storedAcc));
        const storedTx = localStorage.getItem(TRANSACTIONS_KEY);
        if (storedTx) {
          const parsed = JSON.parse(storedTx);
          setTransactions(Array.isArray(parsed) ? parsed : []);
        } else {
          setTransactions([]);
        }
      } catch (e) {
        setTransactions([]);
      }
    };
    load();
    window.addEventListener('storage', load);
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') load();
    };
    window.addEventListener('visibilitychange', handleVisibility);
    return () => {
      window.removeEventListener('storage', load);
      window.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
  }, [transactions]);

  const handleAddTransaction = (tx) => {
    // Always add today's date if not present
    const today = new Date();
    const date = tx.date || today.toISOString().slice(0, 10);
    const txWithDate = { ...tx, date };
    const newTx = [...transactions, txWithDate];
    saveTransactions(newTx);
    window.dispatchEvent(new Event('storage'));
    setShowForm(null);
  };

  const handleShowForm = (type) => {
    if (accounts.length === 0) {
      setTxError('You must add an account before adding a transaction.');
      setTimeout(() => setTxError(''), 3000);
      return;
    }
    setShowForm(type);
  };

  return (
    <div className="ei-root">
      <h2 className="ei-title">Expense & Income</h2>
      <div className="ei-actions">
        <button className="ei-btn" onClick={() => handleShowForm('income')}>Add New Income</button>
        <button className="ei-btn" onClick={() => handleShowForm('expense')}>Add New Expense</button>
        {txError && <div className="ei-error-msg">{txError}</div>}
      </div>
      {showForm && (
        <AddTransactionForm
          onClose={() => setShowForm(null)}
          onAdd={handleAddTransaction}
          accounts={accounts}
          forceType={showForm === 'income' ? 'Income' : 'Expense'}
        />
      )}
      <div className="ei-card-area">
        <div className="ei-table-area">
          <table className="home-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Type</th>
                <th>Account</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', color: '#888' }}>No transactions yet.</td>
                </tr>
              ) : (
                transactions.map((t, i) => (
                  <tr key={i} className={t.type === 'Income' ? 'row-income' : 'row-expense'}>
                    <td>{t.date}</td>
                    <td>{t.desc}</td>
                    <td style={{color: t.type === 'Expense' ? '#b30000' : '#08702b', fontWeight: 600}}>{parseFloat(t.amount).toFixed(2)}</td>
                    <td>{t.type}</td>
                    <td>{t.account}</td>
                    <td>{t.category ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ width: 14, height: 14, background: t.category.color, borderRadius: '50%', display: 'inline-block' }}></span>
                        <span>{t.category.name}</span>
                      </span>
                    ) : '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExpenseIncome;
