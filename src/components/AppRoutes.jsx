import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

import Landing from '.';
import Home from './Home';
import ExpenseIncome from './ExpenseIncome';
import Reports from './Reports';
import Transfer from './Transfer';
import Accounts from './Accounts';
import Logout from './Logout';
import SignUpPage from './SignUpPage';
import LoginPage from './LoginPage';
import { getUserAuth } from '../services/localStorage';

// Helper to check if user is logged in
const isLoggedIn = () => {
  const user = getUserAuth();
  return !!user;
};

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  if (!isLoggedIn()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Landing />} />
    <Route path="/signup" element={<SignUpPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/home" element={
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    } />
    <Route path="/expense-income" element={
      <ProtectedRoute>
        <ExpenseIncome />
      </ProtectedRoute>
    } />
    <Route path="/reports" element={
      <ProtectedRoute>
        <Reports />
      </ProtectedRoute>
    } />
    <Route path="/transfer" element={
      <ProtectedRoute>
        <Transfer />
      </ProtectedRoute>
    } />
    <Route path="/accounts" element={
      <ProtectedRoute>
        <Accounts />
      </ProtectedRoute>
    } />
    <Route path="/logout" element={<Logout />} />
  </Routes>
);

export default AppRoutes;
