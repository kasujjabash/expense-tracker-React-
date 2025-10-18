import { useState, useEffect } from "react";
import {
  getTransactions,
  setTransactions as saveTransactions,
} from "../services/localStorage";

const useTransactions = () => {
  const [transactions, setTransactions] = useState([]);

  // Load transactions from localStorage on component mount
  useEffect(() => {
    const savedTransactions = getTransactions();
    setTransactions(savedTransactions);
  }, []);

  // Save transactions to localStorage whenever transactions change
  useEffect(() => {
    if (transactions.length >= 0) {
      // Allow saving empty arrays
      saveTransactions(transactions);
    }
  }, [transactions]);

  const addTransaction = (transaction) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
      date: transaction.date || new Date().toISOString().split("T")[0],
    };
    setTransactions((prev) => [newTransaction, ...prev]);
  };

  const deleteTransaction = (id) => {
    setTransactions((prev) =>
      prev.filter((transaction) => transaction.id !== id)
    );
  };

  const updateTransaction = (id, updatedTransaction) => {
    setTransactions((prev) =>
      prev.map((transaction) =>
        transaction.id === id
          ? { ...transaction, ...updatedTransaction }
          : transaction
      )
    );
  };

  return {
    transactions,
    setTransactions,
    addTransaction,
    deleteTransaction,
    updateTransaction,
  };
};

export default useTransactions;
