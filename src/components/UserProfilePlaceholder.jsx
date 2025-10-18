import React from 'react';
import { getUserAuth } from '../services/localStorage';
import '../styles/UserProfilePlaceholder.css';

const UserProfilePlaceholder = () => {
  const user = getUserAuth() || {};
  return (
    <div className="user-profile-placeholder">
      {user.image ? (
        <img src={user.image} alt="Profile" className="user-avatar" style={{ width: 48, height: 48, borderRadius: '50%' }} />
      ) : (
        <div className="user-avatar" />
      )}
      <p style={{ fontWeight: 600, marginTop: 8 }}>{user.name || 'User'}</p>
    </div>
  );
};

export default UserProfilePlaceholder;
