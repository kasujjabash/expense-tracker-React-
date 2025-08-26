import React, { useState, useEffect } from 'react';
import '../styles/AccountForm.css';

const defaultTypes = ['Checking', 'Savings', 'Credit Card', 'Cash'];

const AccountForm = ({ onSave, onCancel, initial }) => {
  const [name, setName] = useState(initial?.name || '');
  const [amount, setAmount] = useState(initial?.amount || '');
  const [type, setType] = useState(initial?.type || defaultTypes[0]);

  useEffect(() => {
    if (initial) {
      setName(initial.name);
      setAmount(initial.amount);
      setType(initial.type);
    }
  }, [initial]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || amount === '') return;
    onSave({ name, amount: parseFloat(amount), type });
  };

  return (
    <div className="modal-backdrop">
      <form className="account-form" onSubmit={handleSubmit}>
        <h3>{initial ? 'Edit Account' : 'Add Account'}</h3>
        <label>
          Account Name
          <input value={name} onChange={e => setName(e.target.value)} required />
        </label>
        <label>
          Amount
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)} required min="0" step="0.01" />
        </label>
        <label>
          Type
          <select value={type} onChange={e => setType(e.target.value)}>
            {defaultTypes.map(t => <option key={t}>{t}</option>)}
          </select>
        </label>
        <div className="form-actions">
          <button type="submit">{initial ? 'Save' : 'Add'}</button>
          <button type="button" onClick={onCancel} className="cancel">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default AccountForm;
