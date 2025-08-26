import React, { useState } from 'react';
import '../styles/AddAccountForm.css';

const AddAccountForm = ({ onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('Checking');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({ name, type });
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <form className="account-form" onSubmit={handleSubmit}>
        <h3>Add Account</h3>
        <label>
          Account Name
          <input value={name} onChange={e => setName(e.target.value)} required />
        </label>
        <label>
          Type
          <select value={type} onChange={e => setType(e.target.value)}>
            <option>Checking</option>
            <option>Savings</option>
            <option>Credit Card</option>
            <option>Cash</option>
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

export default AddAccountForm;
