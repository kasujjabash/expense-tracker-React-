

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

  useEffect(() => {
    const load = () => {
      const storedAcc = localStorage.getItem(ACCOUNTS_KEY);
      if (storedAcc) setAccounts(JSON.parse(storedAcc));
      const storedTx = localStorage.getItem(TRANSACTIONS_KEY);
      if (storedTx) setTransactions(JSON.parse(storedTx));
    };
    load();
    window.addEventListener('storage', load);
    return () => window.removeEventListener('storage', load);
  }, []);

  useEffect(() => {
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
  }, [transactions]);

  const handleAddTransaction = (tx) => {
    const newTx = [...transactions, tx];
    setTransactions(newTx);
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(newTx));
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
        {transactions.length === 0 ? (
          <div className="ei-empty">
            <div className="ei-empty-title">You have no transactions</div>
            <div className="ei-empty-desc">You haven't added any transactions. Tap the buttons above to start tracking your spending!</div>
          </div>
        ) : (
          <ul className="ei-tx-list">
            {transactions.map((t, i) => (
              <li key={i} className={t.type === 'Income' ? 'income' : 'expense'}>
                <span>{t.desc}</span> — <span>{t.amount}</span> <span>({t.type})</span> {t.account && <span>- {t.account}</span>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ExpenseIncome;
