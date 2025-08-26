import React, { useState } from 'react';
import '../styles/CategoryForm.css';

const CategoryForm = ({ onSave, onCancel }) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#2196f3');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({ name, color });
    setName('');
    setColor('#2196f3');
  };

  return (
    <div className="modal-backdrop">
      <form className="category-form" onSubmit={handleSubmit}>
        <h3>Add Category</h3>
        <label>
          Name
          <input value={name} onChange={e => setName(e.target.value)} required />
        </label>
        <label>
          Color
          <input type="color" value={color} onChange={e => setColor(e.target.value)} />
        </label>
        <div className="form-actions">
          <button type="submit">Add</button>
          <button type="button" onClick={onCancel} className="cancel">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
