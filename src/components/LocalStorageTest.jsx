/**
 * Simple test component to verify localStorage service functionality
 */
import React, { useState, useEffect } from 'react';
import { 
  getTransactions, 
  setTransactions, 
  getAccounts, 
  setAccounts,
  getCategories,
  setCategories,
  initializeDefaultData,
  isStorageAvailable 
} from '../services/localStorage';

const LocalStorageTest = () => {
  const [status, setStatus] = useState('Checking localStorage...');
  const [data, setData] = useState({
    transactions: [],
    accounts: [],
    categories: []
  });

  useEffect(() => {
    // Check if localStorage is available
    if (!isStorageAvailable()) {
      setStatus('❌ localStorage is not available');
      return;
    }

    // Initialize default data
    initializeDefaultData();

    // Load all data
    const transactions = getTransactions();
    const accounts = getAccounts();
    const categories = getCategories();

    setData({ transactions, accounts, categories });
    setStatus('✅ localStorage service is working correctly');
  }, []);

  const testDataPersistence = () => {
    // Add test data
    const testTransaction = {
      id: Date.now(),
      date: '2025-10-12',
      description: 'Test Transaction',
      amount: '100.00',
      type: 'Expense',
      category: 'Test',
      account: 'Test Account'
    };

    const testAccount = {
      id: Date.now(),
      name: 'Test Account',
      amount: '1000.00',
      type: 'Checking'
    };

    // Save test data
    const currentTransactions = getTransactions();
    const currentAccounts = getAccounts();
    
    setTransactions([...currentTransactions, testTransaction]);
    setAccounts([...currentAccounts, testAccount]);

    // Reload data to verify persistence
    setTimeout(() => {
      const newTransactions = getTransactions();
      const newAccounts = getAccounts();
      
      setData({ 
        transactions: newTransactions, 
        accounts: newAccounts, 
        categories: getCategories() 
      });
      
      setStatus('✅ Data persistence test completed');
    }, 100);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>localStorage Service Test</h2>
      <p><strong>Status:</strong> {status}</p>
      
      <div style={{ marginTop: '20px' }}>
        <button 
          onClick={testDataPersistence}
          style={{
            padding: '10px 20px',
            backgroundColor: '#08702b',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Test Data Persistence
        </button>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3>Current Data:</h3>
        
        <div style={{ marginBottom: '15px' }}>
          <h4>Transactions ({data.transactions.length}):</h4>
          <pre style={{ backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '5px', fontSize: '12px' }}>
            {JSON.stringify(data.transactions, null, 2)}
          </pre>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <h4>Accounts ({data.accounts.length}):</h4>
          <pre style={{ backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '5px', fontSize: '12px' }}>
            {JSON.stringify(data.accounts, null, 2)}
          </pre>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <h4>Categories ({data.categories.length}):</h4>
          <pre style={{ backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '5px', fontSize: '12px' }}>
            {JSON.stringify(data.categories, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default LocalStorageTest;