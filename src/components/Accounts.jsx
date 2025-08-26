
import React, { useState, useEffect } from 'react';
import AccountForm from '../components/AccountForm';
import '../styles/Accounts.css';


const ACCOUNTS_KEY = 'expense-tracker-accounts';

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editIdx, setEditIdx] = useState(null);

  // Load from localStorage on mount and when storage changes
  useEffect(() => {
    const load = () => {
      const stored = localStorage.getItem(ACCOUNTS_KEY);
      if (stored) setAccounts(JSON.parse(stored));
    };
    load();
    window.addEventListener('storage', load);
    return () => window.removeEventListener('storage', load);
  }, []);

  const saveAccounts = (newAccounts) => {
    setAccounts(newAccounts);
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(newAccounts));
  };

  const handleAdd = () => {
    setEditIdx(null);
    setShowForm(true);
  };
  const handleEdit = (idx) => {
    setEditIdx(idx);
    setShowForm(true);
  };
  const handleSave = (acc) => {
    let newAccounts;
    if (editIdx !== null) {
      newAccounts = accounts.map((a, i) => i === editIdx ? acc : a);
    } else {
      newAccounts = [...accounts, acc];
    }
    saveAccounts(newAccounts);
    setShowForm(false);
    setEditIdx(null);
  };
  const handleCancel = () => {
    setShowForm(false);
    setEditIdx(null);
  };

  // Delete account handler
  const handleDelete = (idx) => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      const newAccounts = accounts.filter((_, i) => i !== idx);
      saveAccounts(newAccounts);
    }
  };

  return (
    <div className="accounts-root">
      <div className="accounts-header">
        <h2>Accounts</h2>
        <button className="accounts-add-btn" onClick={handleAdd}>Add Account</button>
      </div>
      <div className="accounts-table-wrap">
        <table className="accounts-table">
          <thead>
            <tr>
              <th>Account Name</th>
              <th>Amount</th>
              <th>Account Type</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {accounts.length === 0 && (
              <tr><td colSpan={5} style={{textAlign:'center', color:'#888'}}>No accounts yet.</td></tr>
            )}
            {accounts.map((acc, i) => (
              <tr key={i}>
                <td>{acc.name}</td>
                <td>{acc.amount}</td>
                <td>{acc.type}</td>
                <td><button className="edit-btn" onClick={() => handleEdit(i)}>Edit</button></td>
                <td><button className="delete-btn" onClick={() => handleDelete(i)} style={{color:'#b30000'}}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showForm && (
        <AccountForm
          onSave={handleSave}
          onCancel={handleCancel}
          initial={editIdx !== null ? accounts[editIdx] : undefined}
        />
      )}
    </div>
  );
};

export default Accounts;
