
import React from 'react';
import { NavLink } from 'react-router-dom';
import UserProfilePlaceholder from './UserProfilePlaceholder';
import './SideMenu.css';

const menuItems = [
  { label: 'Home', to: '/home' },
  { label: 'Expenses & Income', to: '/expense-income' },
  { label: 'Reports', to: '/reports' },
  { label: 'Transfer', to: '/transfer' },
  { label: 'Accounts', to: '/accounts' },
];

const SideMenu = () => {
  return (
    <nav className="side-menu">
      <UserProfilePlaceholder />
      <ul className="side-menu-list">
        {menuItems.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                isActive ? 'side-menu-link active' : 'side-menu-link'
              }
              end={item.to === '/'}
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
      <div className="side-menu-logout">
        <NavLink to="/logout" className="side-menu-link">
          Logout
        </NavLink>
      </div>
    </nav>
  );
};

export default SideMenu;
