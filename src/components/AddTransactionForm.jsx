import React, { useState } from 'react';
import './AddTransactionForm.css';

const AddTransactionForm = ({ onClose, onAdd, accounts = [] }) => {
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Expense');
  const [account, setAccount] = useState(accounts[0] || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!desc.trim() || !amount || !account) return;
    onAdd({ desc, amount: parseFloat(amount), type, account });
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <form className="transaction-form" onSubmit={handleSubmit}>
        <h3>Add Transaction</h3>
        <label>
          Description
          <input value={desc} onChange={e => setDesc(e.target.value)} required />
        </label>
        <label>
          Amount
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)} required min="0.01" step="0.01" />
        </label>
        <label>
          Type
          <select value={type} onChange={e => setType(e.target.value)}>
            <option>Expense</option>
            <option>Income</option>
          </select>
        </label>
        <label>
          Account
          <select value={account} onChange={e => setAccount(e.target.value)}>
            {accounts.map(acc => <option key={acc.name} value={acc.name}>{acc.name}</option>)}
          </select>
        </label>
        <div className="form-actions">
          <button type="submit">Add</button>
          <button type="button" onClick={onClose} className="cancel">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default AddTransactionForm;
