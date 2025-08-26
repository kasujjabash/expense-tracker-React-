
import React, { useState } from 'react';
import '../styles/AddTransactionForm.css';

const AddTransactionForm = ({ onClose, onAdd, accounts = [], categories = [], forceType }) => {
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState(forceType || 'Expense');
  const [account, setAccount] = useState(accounts[0]?.name || '');
  const [category, setCategory] = useState(categories[0] || null);

  // If forceType changes, update type
  React.useEffect(() => {
    if (forceType) setType(forceType);
  }, [forceType]);
  React.useEffect(() => {
    setAccount(accounts[0]?.name || '');
  }, [accounts]);
  React.useEffect(() => {
    setCategory(categories[0] || null);
  }, [categories]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!desc.trim() || !amount || !account) return;
    onAdd({ desc, amount: parseFloat(amount), type, account, category });
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
          <select value={type} onChange={e => setType(e.target.value)} disabled={!!forceType}>
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
        <label>
          Category
          <select value={category ? category.name : ''} onChange={e => setCategory(categories.find(c => c.name === e.target.value) || null)}>
            {categories.length === 0 && <option value="">No categories</option>}
            {categories.map(cat => (
              <option key={cat.name} value={cat.name}>{cat.name}</option>
            ))}
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
