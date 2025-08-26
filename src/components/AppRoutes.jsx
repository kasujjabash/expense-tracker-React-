import React from 'react';
import { Routes, Route } from 'react-router-dom';



import Landing from './Landing';
import Home from './Home';
import ExpenseIncome from './ExpenseIncome';
import Reports from './Reports';
import Transfer from './Transfer';
import Accounts from './Accounts';
import Logout from './Logout';


const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Landing />} />
    <Route path="/home" element={<Home />} />
    <Route path="/expense-income" element={<ExpenseIncome />} />
    <Route path="/reports" element={<Reports />} />
    <Route path="/transfer" element={<Transfer />} />
    <Route path="/accounts" element={<Accounts />} />
    <Route path="/logout" element={<Logout />} />
  </Routes>
);

export default AppRoutes;
