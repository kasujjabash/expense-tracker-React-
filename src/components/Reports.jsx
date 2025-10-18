
import React, { useState, useEffect, useMemo } from 'react';
import useTransactions from '../hooks/useTransactions';
import { formatCurrency } from '../utils/currency';
import { getAccounts } from '../services/localStorage';
import '../styles/Reports.css';

const Reports = () => {
  const { transactions } = useTransactions();
  const [accounts, setAccounts] = useState([]);
  
  // Load accounts from localStorage 
  useEffect(() => {
    const storedAccounts = getAccounts();
    setAccounts(storedAccounts);
  }, []);
  
  // Add some sample data if no transactions exist
  const sampleTransactions = [
    {
      id: '1',
      date: '2025-10-01',
      description: 'Grocery Shopping',
      category: 'Food',
      type: 'Expense',
      amount: '85.50'
    },
    {
      id: '2',
      date: '2025-10-02',
      description: 'Salary',
      category: 'Income',
      type: 'Income',
      amount: '3000.00'
    },
    {
      id: '3',
      date: '2025-10-03',
      description: 'Gas Station',
      category: 'Transportation',
      type: 'Expense',
      amount: '45.00'
    }
  ];
  
  const allTransactions = transactions.length > 0 ? transactions : sampleTransactions;
  const [selectedPeriod, setSelectedPeriod] = useState('thisMonth');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [exportFormat, setExportFormat] = useState('pdf');

  // Filter transactions based on selected period
  const filteredTransactions = useMemo(() => {
    const now = new Date();
    let startDate, endDate;

    switch (selectedPeriod) {
      case 'thisWeek':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
        endDate = now;
        break;
      case 'thisMonth':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = now;
        break;
      case 'last3Months':
        startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
        endDate = now;
        break;
      case 'thisYear':
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = now;
        break;
      default:
        return allTransactions;
    }

    return allTransactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= startDate && transactionDate <= endDate;
    });
  }, [allTransactions, selectedPeriod]);

  // Calculate spending by category (same as Home screen logic)
  const categorySpending = useMemo(() => {
    const categories = {};
    filteredTransactions
      .filter(t => t.type === 'Expense')
      .forEach(transaction => {
        const category = transaction.category || 'Uncategorized';
        categories[category] = (categories[category] || 0) + parseFloat(transaction.amount);
      });
    return Object.entries(categories).map(([name, amount]) => ({ name, amount }));
  }, [filteredTransactions]);

  // Calculate totals using the same logic as Home screen
  const totals = useMemo(() => {
    // Total balance: sum of all account balances (initial + income - expenses per account)
    // Use ALL transactions, not filtered ones, same as Home screen
    const totalBalance = accounts.reduce((sum, acc) => {
      const initial = parseFloat(acc.amount) || 0;
      const spent = allTransactions.filter(t => t.account === acc.name && t.type === 'Expense').reduce((s, t) => s + (parseFloat(t.amount) || 0), 0);
      const added = allTransactions.filter(t => t.account === acc.name && t.type === 'Income').reduce((s, t) => s + (parseFloat(t.amount) || 0), 0);
      return sum + (initial - spent + added);
    }, 0);
    
    // Total spent: sum ALL expenses (same as Home screen) - not filtered by date
    const totalSpent = allTransactions.filter(t => t.type === 'Expense').reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
    
    // Total income from all transactions 
    const totalIncomeTransactions = allTransactions.filter(t => t.type === 'Income').reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
    
    // For the selected period
    const periodSpent = filteredTransactions.filter(t => t.type === 'Expense').reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
    const periodIncome = filteredTransactions.filter(t => t.type === 'Income').reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
    
    return { 
      income: totalIncomeTransactions, 
      expenses: totalSpent, 
      net: totalBalance,
      totalBalance: totalBalance,
      periodSpent: periodSpent,
      periodIncome: periodIncome 
    };
  }, [filteredTransactions, allTransactions, accounts]);

  // Export functionality
  const handleExport = () => {
    const reportData = {
      period: selectedPeriod,
      totals,
      categorySpending,
      transactions: filteredTransactions,
      generatedAt: new Date().toLocaleString()
    };

    if (exportFormat === 'csv') {
      exportToCSV(reportData);
    } else if (exportFormat === 'json') {
      exportToJSON(reportData);
    } else {
      alert('PDF export would be implemented with a library like jsPDF');
    }
  };

  const exportToCSV = (data) => {
    const csvContent = [
      ['Date', 'Description', 'Category', 'Type', 'Amount'],
      ...data.transactions.map(t => [
        t.date, t.description, t.category, t.type, t.amount
      ])
    ].map(row => row.join(',')).join('\n');

    downloadFile(csvContent, `expense-report-${selectedPeriod}.csv`, 'text/csv');
  };

  const exportToJSON = (data) => {
    const jsonContent = JSON.stringify(data, null, 2);
    downloadFile(jsonContent, `expense-report-${selectedPeriod}.json`, 'application/json');
  };

  const downloadFile = (content, filename, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="reports-root">
      <div className="reports-header">
        <h2 className="reports-title">Financial Reports</h2>
        <div className="reports-controls">
          <select 
            value={selectedPeriod} 
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="reports-select"
          >
            <option value="thisWeek">This Week</option>
            <option value="thisMonth">This Month</option>
            <option value="last3Months">Last 3 Months</option>
            <option value="thisYear">This Year</option>
          </select>
          <button onClick={handleExport} className="reports-export-btn">
            Export Report
          </button>
        </div>
      </div>

      {filteredTransactions.length === 0 ? (
        <div className="reports-empty">
          <div className="empty-icon">📊</div>
          <h3>No Data Available</h3>
          <p>Start tracking your expenses to see detailed reports here.</p>
        </div>
      ) : (
        <div className="reports-content">
          {/* Summary Cards */}
          <div className="reports-summary">
            <div className="summary-card income">
              <div className="summary-icon">💰</div>
              <div className="summary-details">
                <h3>Total Balance</h3>
                <div className="summary-amount">{formatCurrency(totals.totalBalance)}</div>
              </div>
            </div>
            <div className="summary-card expense">
              <div className="summary-icon">💸</div>
              <div className="summary-details">
                <h3>Total Spent</h3>
                <div className="summary-amount">{formatCurrency(totals.expenses)}</div>
              </div>
            </div>
            <div className="summary-card income">
              <div className="summary-icon">�</div>
              <div className="summary-details">
                <h3>Income Transactions</h3>
                <div className="summary-amount">{formatCurrency(totals.income)}</div>
              </div>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="reports-section">
            <h3 className="section-title">Spending by Category</h3>
            <div className="category-breakdown">
              {categorySpending.length === 0 ? (
                <p className="no-data">No expense data for this period</p>
              ) : (
                categorySpending.map(({ name, amount }) => (
                  <div key={name} className="category-item">
                    <div className="category-info">
                      <span className="category-name">{name}</span>
                      <span className="category-percentage">
                        {((amount / totals.expenses) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="category-bar">
                      <div 
                        className="category-fill" 
                        style={{ width: `${(amount / totals.expenses) * 100}%` }}
                      ></div>
                    </div>
                    <span className="category-amount">{formatCurrency(amount)}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="reports-section">
            <h3 className="section-title">Recent Transactions</h3>
            <div className="recent-transactions">
              {filteredTransactions.slice(0, 10).map((transaction, index) => (
                <div key={index} className={`transaction-item ${transaction.type}`}>
                  <div className="transaction-date">
                    {new Date(transaction.date).toLocaleDateString()}
                  </div>
                  <div className="transaction-details">
                    <div className="transaction-description">{transaction.description}</div>
                    <div className="transaction-category">{transaction.category}</div>
                  </div>
                  <div className={`transaction-amount ${transaction.type.toLowerCase()}`}>
                    {transaction.type === 'Income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Export Options */}
          <div className="reports-section">
            <h3 className="section-title">Export Options</h3>
            <div className="export-options">
              <select 
                value={exportFormat} 
                onChange={(e) => setExportFormat(e.target.value)}
                className="export-select"
              >
                <option value="pdf">PDF Report</option>
                <option value="csv">CSV Data</option>
                <option value="json">JSON Data</option>
              </select>
              <button onClick={handleExport} className="export-button">
                Download {exportFormat.toUpperCase()}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
