
import React from 'react';
import { useLocation } from 'react-router-dom';
import SideMenu from './components/SideMenu';
import AppRoutes from './components/AppRoutes';
import './AppLayout.css';

const AppLayout = () => {
  const { pathname } = useLocation();
  const isLanding = pathname === '/';
  return isLanding ? (
    <main className="main-content">
      <AppRoutes />
    </main>
  ) : (
    <div className="app-layout">
      <SideMenu />
      <main className="main-content">
        <AppRoutes />
      </main>
    </div>
  );
};

export default AppLayout;
