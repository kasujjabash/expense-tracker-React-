
import React from 'react';
import { useLocation } from 'react-router-dom';
import SideMenu from './components/SideMenu';
import AppRoutes from './components/AppRoutes';
import './AppLayout.css';

const AppLayout = () => {
  const { pathname } = useLocation();
  const isLanding = pathname === '/';
  const isSignup = pathname === '/signup';
  const isLogin = pathname === '/login';
  if (isLanding || isSignup || isLogin) {
    return (
      <main className="main-content">
        <AppRoutes />
      </main>
    );
  }
  return (
    <div className="app-layout">
      <SideMenu />
      <main className="main-content">
        <AppRoutes />
      </main>
    </div>
  );
};

export default AppLayout;
