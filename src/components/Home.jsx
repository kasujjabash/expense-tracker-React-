import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AccountForm from '../components/AccountForm';
import AddTransactionForm from '../components/AddTransactionForm';
import CategoryForm from '../components/CategoryForm';
import useTransactions from '../hooks/useTransactions';
import { formatCurrency } from '../utils/currency';
import { getAccounts, setAccounts as saveAccounts, getCategories, setCategories as saveCategories } from '../services/localStorage';
import '../styles/Home.css';
import Chart from './Chart';
import Graph from './Graph';

const Home = () => {
  const location = useLocation();
  const { transactions, addTransaction } = useTransactions();
  const [showAccount, setShowAccount] = useState(false);
  const [showTransaction, setShowTransaction] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showCategory, setShowCategory] = useState(false);
  const [txError, setTxError] = useState('');
  const [showWarning, setShowWarning] = useState(false);
  const [warningMsg, setWarningMsg] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Filter and search transactions for current month
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.desc?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = dateFilter ? t.date === dateFilter : true;
    // Only include transactions from current month
    const txDate = t.date ? new Date(t.date) : null;
    const matchesMonth = txDate && txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear;
    return matchesSearch && matchesDate && matchesMonth;
  });
  // Sort by date descending
  const sortedTransactions = [...filteredTransactions].sort((a, b) => new Date(b.date) - new Date(a.date));

  // Data for chart/graph: all current month transactions
  const chartData = transactions.filter(t => {
    const txDate = t.date ? new Date(t.date) : null;
    return txDate && txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear;
  });

  // Calculate total balance and total spent
  const totalBalance = accounts.reduce((sum, acc) => {
    const initial = parseFloat(acc.amount) || 0;
    const spent = transactions.filter(t => t.account === acc.name && t.type === 'Expense').reduce((s, t) => s + (parseFloat(t.amount) || 0), 0);
    const added = transactions.filter(t => t.account === acc.name && t.type === 'Income').reduce((s, t) => s + (parseFloat(t.amount) || 0), 0);
    return sum + (initial - spent + added);
  }, 0);
  // Total spent: sum all expenses, even for deleted accounts
  const totalSpent = transactions.filter(t => t.type === 'Expense').reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);

  // Load from localStorage on mount, add default categories if none
  useEffect(() => {
    const defaultCategories = [
      { name: 'Food', color: '#e57373' },
      { name: 'Transport', color: '#64b5f6' },
      { name: 'Shopping', color: '#81c784' },
      { name: 'Bills', color: '#ffd54f' },
      { name: 'Health', color: '#ba68c8' },
      { name: 'Salary', color: '#08702b' },
      { name: 'Other', color: '#90a4ae' },
    ];
    const loadData = () => {
      // Load accounts
      const storedAccounts = getAccounts();
      setAccounts(storedAccounts);
      // Transactions are now managed by useTransactions hook
      // Load categories
      const storedCategories = getCategories();
      const cats = storedCategories.length > 0 ? storedCategories : defaultCategories;
      setCategories(cats);
      if (storedCategories.length === 0) {
        setCategories(defaultCategories);
      }
    };
    loadData();
    window.addEventListener('storage', loadData);
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') loadData();
    };
    window.addEventListener('visibilitychange', handleVisibility);
    return () => {
      window.removeEventListener('storage', loadData);
      window.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);



  // Save categories to localStorage whenever categories change
  useEffect(() => {
    if (categories.length > 0) {
      console.log('[Home] Saving categories to localStorage:', categories);
      saveCategories(categories);
    }
  }, [categories]);

  // Save accounts to localStorage whenever accounts change
  useEffect(() => {
    if (accounts.length > 0) {
      console.log('[Home] Saving accounts to localStorage:', accounts);
      saveAccounts(accounts);
    }
  }, [accounts]);


  // Per-account warning state: [{name, type: 'empty'|'low', closed: false}]
  const [accountWarnings, setAccountWarnings] = useState([]);
  useEffect(() => {
    if (accounts.length === 0) {
      setAccountWarnings([]);
      return;
    }
    const newWarnings = accounts.map(acc => {
      const initial = parseFloat(acc.amount) || 0;
      const spent = transactions.filter(t => t.account === acc.name && t.type === 'Expense').reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
      const added = transactions.filter(t => t.account === acc.name && t.type === 'Income').reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
      const current = initial - spent + added;
      if (current <= 0) {
        return { name: acc.name, type: 'empty', closed: false };
      } else if (initial > 0 && current / initial <= 0.2) {
        return { name: acc.name, type: 'low', closed: false };
      } else {
        return null;
      }
    }).filter(Boolean);
    setAccountWarnings(newWarnings);
  }, [transactions, accounts]);

  // Handler to close a specific warning
  const closeAccountWarning = (name, type) => {
    setAccountWarnings(warnings => warnings.map(w => (w.name === name && w.type === type) ? { ...w, closed: true } : w));
  };

  const handleAddCategory = (newCategory) => {
    console.log('[Home] Adding new category:', newCategory);
    const updatedCategories = [...categories, newCategory];
    setCategories(updatedCategories);
    setShowCategory(false);
  };

  const handleAddAccount = (newAccount) => {
    console.log('[Home] Adding new account:', newAccount);
    const updatedAccounts = [...accounts, newAccount];
    setAccounts(updatedAccounts);
    setShowAccount(false);
  };

  const handleAddTransaction = (newTransaction) => {
    // Always add today's date if not present
    const today = new Date();
    const date = newTransaction.date || today.toISOString().slice(0, 10);
    const txWithDate = { ...newTransaction, date };

    // Check for sufficient balance if Expense
    if (txWithDate.type === 'Expense') {
      const accIdx = accounts.findIndex(a => a.name === txWithDate.account);
      if (accIdx !== -1) {
        const acc = accounts[accIdx];
        const initial = parseFloat(acc.amount) || 0;
        const spent = transactions.filter(t => t.account === acc.name && t.type === 'Expense').reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
        const added = transactions.filter(t => t.account === acc.name && t.type === 'Income').reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
        const current = initial - spent + added;
        if (parseFloat(txWithDate.amount) > current) {
          setTxError('Insufficient balance in this account for this expense.');
          setTimeout(() => setTxError(''), 3500);
          return;
        }
        // Deduct from account balance (for display only, actual balance is always computed live)
        // Optionally, update the account's amount if you want to persist the new balance
      }
    }
    addTransaction(txWithDate);
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

  // Compute account balances for display
  const accountBalances = accounts.map(acc => {
    const initial = parseFloat(acc.amount) || 0;
    const spent = transactions
      .filter(t => t.account === acc.name && t.type === 'Expense')
      .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
    const added = transactions
      .filter(t => t.account === acc.name && t.type === 'Income')
      .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
    const current = initial - spent + added;
    return { ...acc, current };
  });

  return (
    <div className="home-root">
      {/* Warning Section - always visible if triggered, above summary bar */}
      {accountWarnings.map(warning => !warning.closed && (
        <div key={warning.name + warning.type} style={{
          position: 'relative',
          background: warning.type === 'empty' ? '#ffcccc' : '#fff7b2',
          color: warning.type === 'empty' ? '#b30000' : '#b28500',
          border: `2px solid ${warning.type === 'empty' ? '#b30000' : '#b28500'}`,
          borderRadius: 8,
          padding: '1rem 2.5rem 1rem 1.5rem',
          margin: '1.5rem auto 1.5rem auto',
          maxWidth: 600,
          fontWeight: 600,
          fontSize: '1.08rem',
          textAlign: 'center',
          boxShadow: warning.type === 'empty' ? '0 2px 8px #ffcccc88' : '0 2px 8px #fff7b288',
        }}>
          {warning.type === 'empty'
            ? `Alert: Your account "${warning.name}" is empty! Please add money to continue using this account.`
            : `Warning: Your account "${warning.name}" is below 20% of its initial balance. Add money soon!`}
          <button
            onClick={() => closeAccountWarning(warning.name, warning.type)}
            style={{
              position: 'absolute',
              right: 12,
              top: 10,
              background: 'transparent',
              border: 'none',
              color: warning.type === 'empty' ? '#b30000' : '#b28500',
              fontWeight: 700,
              fontSize: 20,
              cursor: 'pointer',
              lineHeight: 1,
            }}
            aria-label="Close warning"
          >×</button>
        </div>
      ))}

      {/* Summary Section */}
      <div className="home-summary-bar" style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '2.5rem',
        margin: '2rem 0 1.5rem 0',
        fontWeight: 600,
        fontSize: '1.15rem',
      }}>
        <span>Total Balance: <span style={{ color: '#08702b' }}>{formatCurrency(totalBalance)}</span></span>
        <span>Total Spent: <span style={{ color: '#b30000' }}>{formatCurrency(totalSpent)}</span></span>
      </div>

      <div className="home-actions-bar" style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: '1rem', 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginBottom: '2.5rem', 
        marginTop: '0' 
      }}>
        <button className="home-action-btn" onClick={() => setShowAccount(true)}>
          Add Account
        </button>
        <button className="home-action-btn" onClick={handleShowTransaction}>
          Add Transaction
        </button>
        <button className="home-action-btn" onClick={() => setShowCategory(true)}>
          Add Category
        </button>
        <input
          type="text"
          placeholder="Search description..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="home-search-input"
          style={{ minWidth: 180, marginLeft: 12 }}
        />
        <input
          type="date"
          value={dateFilter}
          onChange={e => setDateFilter(e.target.value)}
          className="home-date-input"
        />
        <button 
          onClick={() => { setSearchTerm(''); setDateFilter(''); }} 
          className="home-clear-btn"
        >
          Clear
        </button>
      </div>

      {showWarning && <div className="home-warning">{warningMsg}</div>}
      


      {txError && <div className="home-error-msg">{txError}</div>}

      {showCategory && (
        <CategoryForm onSave={handleAddCategory} onCancel={() => setShowCategory(false)} />
      )}

      {showAccount && (
        <div className="home-account-form-area">
          <AccountForm onSave={handleAddAccount} onCancel={() => setShowAccount(false)} />
        </div>
      )}

      {showTransaction && (
        <AddTransactionForm 
          onClose={() => setShowTransaction(false)} 
          onAdd={handleAddTransaction} 
          accounts={accounts} 
          categories={categories} 
        />
      )}

      <div className="home-list-area">
        <div className="home-section">
          <h4>Transactions</h4>
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
              {(sortedTransactions.length === 0) ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', color: '#888' }}>No transactions yet.</td>
                </tr>
              ) : (
                sortedTransactions.slice(0, 5).map((t, i) => (
                  <tr key={`${t.date}-${t.desc}-${i}`} className={t.type === 'Income' ? 'row-income' : 'row-expense'}>
                    <td>{t.date}</td>
                    <td>{t.desc}</td>
                    <td style={{ color: t.type === 'Expense' ? '#b30000' : '#08702b', fontWeight: 600 }}>
                      {formatCurrency(t.amount || 0)}
                    </td>
                    <td>{t.type}</td>
                    <td>{t.account}</td>
                    <td>
                      {t.category ? (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ width: 14, height: 14, background: t.category.color, borderRadius: '50%', display: 'inline-block' }}></span>
                          <span>{t.category.name}</span>
                        </span>
                      ) : '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {sortedTransactions.length > 5 && (
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <a href="/expense-income" className="home-view-all-btn">View all transactions</a>
            </div>
          )}
          {/* Chart and Graph Section */}
          <div className="home-chart-area" style={{
            marginTop: '2.5rem',
            padding: '2.5rem 2rem 2rem 2rem',
            borderRadius: 18,
            maxWidth: 1200,
            marginLeft: 'auto',
            marginRight: 'auto',
          }}>
            <h3 style={{
              textAlign: 'center',
              fontWeight: 700,
              fontSize: '1.45rem',
              letterSpacing: 0.2,
              color: '#1a2a3a',
              marginBottom: '2.2rem',
              color: '#08702b',
            }}>
             Monthly Spending Summary
            </h3>
            <div style={{
              display: 'flex',
              gap: '3.5rem',
              justifyContent: 'center',
              alignItems: 'flex-start',
              flexWrap: 'wrap',
            }}>
              <div style={{
                width: 420,
                background: '#fff',
                borderRadius: 14,
                boxShadow: '0 2px 12px 0 rgba(60,60,120,0.07)',
                padding: '1.5rem 1.2rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minHeight: 380,
              }}>
                <Chart data={chartData} title="Expenses by Category (Pie)" categories={categories} />
              </div>
              <div style={{
                width: 540,
                background: '#fff',
                borderRadius: 14,
                boxShadow: '0 2px 12px 0 rgba(60,60,120,0.07)',
                padding: '1.5rem 1.2rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minHeight: 380,
              }}>
                <Graph data={chartData} title="Income vs Expenses (Line)" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;