


import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AccountForm from '../components/AccountForm';
import AddTransactionForm from '../components/AddTransactionForm';
import CategoryForm from '../components/CategoryForm';
import '../styles/Home.css';



const ACCOUNTS_KEY = 'expense-tracker-accounts';
const TRANSACTIONS_KEY = 'expense-tracker-transactions';
const CATEGORIES_KEY = 'expense-tracker-categories';

const Home = () => {
  const location = useLocation();
  const [showAccount, setShowAccount] = useState(false);
  const [showTransaction, setShowTransaction] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showCategory, setShowCategory] = useState(false);
  const [txError, setTxError] = useState('');
  const [showWarning, setShowWarning] = useState(false);
  const [warningMsg, setWarningMsg] = useState('');

  // Load from localStorage on mount and when storage changes (like Accounts screen)
  useEffect(() => {
    const load = () => {
      const storedAccounts = localStorage.getItem(ACCOUNTS_KEY);
      if (storedAccounts) setAccounts(JSON.parse(storedAccounts));
      const storedTransactions = localStorage.getItem(TRANSACTIONS_KEY);
      if (storedTransactions) {
        const parsedTx = JSON.parse(storedTransactions);
        setTransactions(parsedTx);
        console.log('[Home] Loaded transactions from localStorage:', parsedTx);
      } else {
        setTransactions([]);
        console.log('[Home] No transactions found in localStorage');
      }
      const storedCategories = localStorage.getItem(CATEGORIES_KEY);
      if (storedCategories) setCategories(JSON.parse(storedCategories));
    };
    load();
    window.addEventListener('storage', load);
    return () => window.removeEventListener('storage', load);
  }, []);
  useEffect(() => {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
  }, [categories]);
  const handleAddCategory = (cat) => {
    const storedCategories = localStorage.getItem(CATEGORIES_KEY);
    const currentCategories = storedCategories ? JSON.parse(storedCategories) : [];
    const newCategories = [...currentCategories, cat];
    setCategories(newCategories);
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(newCategories));
    setShowCategory(false);
  };


  // Calculate balances and warning
  useEffect(() => {
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));

    // Calculate balances
    let warning = false;
    let msg = '';
    accounts.forEach(acc => {
      const initial = parseFloat(acc.amount);
      const spent = transactions.filter(t => t.account === acc.name && t.type === 'Expense').reduce((sum, t) => sum + parseFloat(t.amount), 0);
      const added = transactions.filter(t => t.account === acc.name && t.type === 'Income').reduce((sum, t) => sum + parseFloat(t.amount), 0);
      const current = initial - spent + added;
      if (initial > 0 && current / initial <= 0.2) {
        warning = true;
        msg = `Warning: Your account "${acc.name}" is below 20% of its initial balance. Add money soon!`;
      }
    });
    setShowWarning(warning);
    setWarningMsg(msg);
  }, [transactions, accounts]);

  const handleAddAccount = (acc) => {
    // Always use the latest from localStorage to avoid overwriting
    const storedAccounts = localStorage.getItem(ACCOUNTS_KEY);
    const currentAccounts = storedAccounts ? JSON.parse(storedAccounts) : [];
    const newAccounts = [...currentAccounts, acc];
    setAccounts(newAccounts);
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(newAccounts));
    setShowAccount(false);
  };
  const handleAddTransaction = (tx) => {
    const newTx = [...transactions, tx];
    setTransactions(newTx);
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(newTx));
    setShowTransaction(false);
  };

  const handleShowTransaction = () => {
    if (accounts.length === 0) {
      setTxError('You must add an account before adding a transaction.');
      setTimeout(() => setTxError(''), 3000);
      return;
    }
    setShowTransaction(true);
  };

  // Compute account balances
  const accountBalances = accounts.map(acc => {
    const initial = parseFloat(acc.amount);
    const spent = transactions.filter(t => t.account === acc.name && t.type === 'Expense').reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const added = transactions.filter(t => t.account === acc.name && t.type === 'Income').reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const current = initial - spent + added;
    return { ...acc, initial, current };
  });

  // Debug: log transactions state on every render
  console.log('[Home] transactions state:', transactions);

  return (
    <div className="home-root">
      <h2 className="home-title">Home</h2>
      {showWarning && (
        <div className="home-warning-msg">{warningMsg}</div>
      )}
      {transactions.length === 0 && (
        <div className="home-card-area home-card-cards">
          <div className="home-card">
            <div className="home-card-title">Add Account</div>
            <div className="home-card-desc">Create a new account to track your money (e.g., Bank, Cash, Credit Card).</div>
            <button className="home-action-btn" onClick={() => setShowAccount(true)}>
              Add Account
            </button>
          </div>
          <div className="home-card">
            <div className="home-card-title">Add Transaction</div>
            <div className="home-card-desc">Record an expense or income to see your spending and balance.</div>
            <button className="home-action-btn" onClick={handleShowTransaction}>
              Add Transaction
            </button>
          </div>
          <div className="home-card">
            <div className="home-card-title">Add Category</div>
            <div className="home-card-desc">Organize your spending by adding categories (e.g., Food, Transport).</div>
            <button className="home-action-btn" onClick={() => setShowCategory(true)}>
              Add Category
            </button>
          </div>
          {txError && <div className="home-error-msg">{txError}</div>}
        </div>
      )}
      {showCategory && (
        <CategoryForm onSave={handleAddCategory} onCancel={() => setShowCategory(false)} />
      )}
      {showAccount && (
        <div className="home-account-form-area">
          <AccountForm onSave={handleAddAccount} onCancel={() => setShowAccount(false)} />
        </div>
      )}
      {showTransaction && (
        <AddTransactionForm onClose={() => setShowTransaction(false)} onAdd={handleAddTransaction} accounts={accounts} categories={categories} />
      )}
      <div className="home-list-area">
        {transactions.length > 0 && (
          <div className="home-section">
            <h4>Transactions</h4>
            <table className="home-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Type</th>
                  <th>Account</th>
                  <th>Category</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t, i) => (
                  <tr key={i} className={t.type === 'Income' ? 'row-income' : 'row-expense'}>
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
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
