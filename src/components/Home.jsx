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
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Filter and search transactions
  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.desc?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = dateFilter ? t.date === dateFilter : true;
    return matchesSearch && matchesDate;
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

  // Load from localStorage on mount
  useEffect(() => {
    const loadData = () => {
      // Load accounts
      const storedAccounts = localStorage.getItem(ACCOUNTS_KEY);
      if (storedAccounts) setAccounts(JSON.parse(storedAccounts));
      // Load transactions
      const storedTransactions = localStorage.getItem(TRANSACTIONS_KEY);
      if (storedTransactions) setTransactions(JSON.parse(storedTransactions));
      // Load categories
      const storedCategories = localStorage.getItem(CATEGORIES_KEY);
      if (storedCategories) setCategories(JSON.parse(storedCategories));
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

  // Save transactions to localStorage whenever transactions change
  useEffect(() => {
    if (transactions.length > 0) {
      console.log('[Home] Saving transactions to localStorage:', transactions);
      localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
    }
  }, [transactions]);

  // Save categories to localStorage whenever categories change
  useEffect(() => {
    if (categories.length > 0) {
      console.log('[Home] Saving categories to localStorage:', categories);
      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
    }
  }, [categories]);

  // Save accounts to localStorage whenever accounts change
  useEffect(() => {
    if (accounts.length > 0) {
      console.log('[Home] Saving accounts to localStorage:', accounts);
      localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
    }
  }, [accounts]);

  // Calculate balances and warnings
  useEffect(() => {
    if (accounts.length === 0 || transactions.length === 0) return;

    let warning = false;
    let msg = '';
    
    accounts.forEach(acc => {
      const initial = parseFloat(acc.amount) || 0;
      const spent = transactions
        .filter(t => t.account === acc.name && t.type === 'Expense')
        .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
      const added = transactions
        .filter(t => t.account === acc.name && t.type === 'Income')
        .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
      const current = initial - spent + added;
      
      if (initial > 0 && current / initial <= 0.2) {
        warning = true;
        msg = `Warning: Your account "${acc.name}" is below 20% of its initial balance. Add money soon!`;
      }
    });
    
    setShowWarning(warning);
    setWarningMsg(msg);
  }, [transactions, accounts]);

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
    const updatedTransactions = [...transactions, txWithDate];
    setTransactions(updatedTransactions);
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
      {/* Summary Section */}
      <div className="home-summary-bar" style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '2.5rem',
        margin: '2rem 0 1.5rem 0',
        fontWeight: 600,
        fontSize: '1.15rem',
      }}>
        <span>Total Balance: <span style={{ color: '#08702b' }}>{totalBalance.toFixed(2)}</span></span>
        <span>Total Spent: <span style={{ color: '#b30000' }}>{totalSpent.toFixed(2)}</span></span>
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
              {(filteredTransactions.length === 0) ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', color: '#888' }}>No transactions yet.</td>
                </tr>
              ) : (
                filteredTransactions.slice(0, 5).map((t, i) => (
                  <tr key={`${t.date}-${t.desc}-${i}`} className={t.type === 'Income' ? 'row-income' : 'row-expense'}>
                    <td>{t.date}</td>
                    <td>{t.desc}</td>
                    <td style={{ color: t.type === 'Expense' ? '#b30000' : '#08702b', fontWeight: 600 }}>
                      {parseFloat(t.amount || 0).toFixed(2)}
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
          {filteredTransactions.length > 5 && (
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <a href="/expense-income" className="home-view-all-btn">View all transactions</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;