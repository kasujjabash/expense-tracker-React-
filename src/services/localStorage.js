/**
 * Centralized localStorage service for the Expense Tracker application
 * Provides consistent key management and error handling for all data operations
 */

// Storage keys - centralized for consistency
export const STORAGE_KEYS = {
  TRANSACTIONS: "expense-tracker-transactions",
  ACCOUNTS: "expense-tracker-accounts",
  CATEGORIES: "expense-tracker-categories",
  USER_AUTH: "expense-tracker-auth",
  SETTINGS: "expense-tracker-settings",
};

// Default data structures
export const DEFAULT_DATA = {
  transactions: [],
  accounts: [],
  categories: [
    "Food & Dining",
    "Transportation",
    "Shopping",
    "Entertainment",
    "Bills & Utilities",
    "Healthcare",
    "Travel",
    "Education",
    "Other",
  ],
  userAuth: null,
  settings: {
    currency: "USD",
    dateFormat: "YYYY-MM-DD",
    theme: "light",
  },
};

/**
 * Generic localStorage operations with error handling
 */
class LocalStorageService {
  /**
   * Get data from localStorage
   * @param {string} key - The storage key
   * @param {*} defaultValue - Default value if key doesn't exist
   * @returns {*} Parsed data or default value
   */
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return defaultValue;
      }
      return JSON.parse(item);
    } catch (error) {
      console.error(`Error reading from localStorage key "${key}":`, error);
      return defaultValue;
    }
  }

  /**
   * Set data in localStorage
   * @param {string} key - The storage key
   * @param {*} value - Value to store
   * @returns {boolean} Success status
   */
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      console.log(`[LocalStorage] Saved to ${key}:`, value);
      return true;
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error);
      return false;
    }
  }

  /**
   * Remove data from localStorage
   * @param {string} key - The storage key
   * @returns {boolean} Success status
   */
  remove(key) {
    try {
      localStorage.removeItem(key);
      console.log(`[LocalStorage] Removed key: ${key}`);
      return true;
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
      return false;
    }
  }

  /**
   * Clear all application data from localStorage
   * @returns {boolean} Success status
   */
  clearAll() {
    try {
      Object.values(STORAGE_KEYS).forEach((key) => {
        localStorage.removeItem(key);
      });
      console.log("[LocalStorage] Cleared all application data");
      return true;
    } catch (error) {
      console.error("Error clearing localStorage:", error);
      return false;
    }
  }

  /**
   * Check if localStorage is available
   * @returns {boolean} Availability status
   */
  isAvailable() {
    try {
      const testKey = "__localStorage_test__";
      localStorage.setItem(testKey, "test");
      localStorage.removeItem(testKey);
      return true;
    } catch (error) {
      console.warn("localStorage is not available:", error);
      return false;
    }
  }
}

// Create singleton instance
const storageService = new LocalStorageService();

/**
 * Specific data access methods for the application
 */

// Transactions
export const getTransactions = () => {
  return storageService.get(
    STORAGE_KEYS.TRANSACTIONS,
    DEFAULT_DATA.transactions
  );
};

export const setTransactions = (transactions) => {
  return storageService.set(STORAGE_KEYS.TRANSACTIONS, transactions);
};

// Accounts
export const getAccounts = () => {
  return storageService.get(STORAGE_KEYS.ACCOUNTS, DEFAULT_DATA.accounts);
};

export const setAccounts = (accounts) => {
  return storageService.set(STORAGE_KEYS.ACCOUNTS, accounts);
};

// Categories
export const getCategories = () => {
  return storageService.get(STORAGE_KEYS.CATEGORIES, DEFAULT_DATA.categories);
};

export const setCategories = (categories) => {
  return storageService.set(STORAGE_KEYS.CATEGORIES, categories);
};

// User Authentication
export const getUserAuth = () => {
  return storageService.get(STORAGE_KEYS.USER_AUTH, DEFAULT_DATA.userAuth);
};

export const setUserAuth = (authData) => {
  return storageService.set(STORAGE_KEYS.USER_AUTH, authData);
};

export const clearUserAuth = () => {
  return storageService.remove(STORAGE_KEYS.USER_AUTH);
};

// Settings
export const getSettings = () => {
  return storageService.get(STORAGE_KEYS.SETTINGS, DEFAULT_DATA.settings);
};

export const setSettings = (settings) => {
  return storageService.set(STORAGE_KEYS.SETTINGS, settings);
};

// Utility methods
export const initializeDefaultData = () => {
  console.log("[LocalStorage] Initializing default data...");

  // Only set defaults if data doesn't exist
  if (getTransactions().length === 0) {
    setTransactions(DEFAULT_DATA.transactions);
  }

  if (getAccounts().length === 0) {
    setAccounts(DEFAULT_DATA.accounts);
  }

  if (getCategories().length === 0) {
    setCategories(DEFAULT_DATA.categories);
  }

  if (!getSettings().currency) {
    setSettings(DEFAULT_DATA.settings);
  }
};

export const clearAllData = () => {
  return storageService.clearAll();
};

export const isStorageAvailable = () => {
  return storageService.isAvailable();
};

// Export the service instance for advanced usage
export default storageService;
