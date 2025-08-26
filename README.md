# Vault Path | Expense Tracker

_See where your money goes_

A modern, responsive expense tracker built with React and Vite. Vault Path helps you see where your money goes, manage accounts and transactions, and visualize your spending with a clean, multi-screen UI.

## Features

- **Modern UI**: Clean, attractive design with a side menu and multiple screens (Home, Accounts, Expense & Income, Reports).
- **Accounts Management**: Add and edit accounts (e.g., Bank, Cash, Credit Card) from the Accounts screen or Home.
- **Transactions**: Add expenses and income, assign to accounts, and view all transactions.
- **Validation**: Prevents adding transactions if no accounts exist, with user-friendly error messages.
- **Persistence**: All data (accounts and transactions) is saved in localStorage and persists across page reloads and navigation.
- **Cross-Screen Sync**: Data changes on one screen are immediately reflected on all others, even across browser tabs.
- **Responsive Design**: Works well on desktop and mobile.

## How It Works

### Data Storage

### Data Storage & Local Storage

- **Accounts** are stored in your browser's localStorage under the key `expense-tracker-accounts`.
- **Transactions** are stored under the key `expense-tracker-transactions`.
- **Categories** are stored under the key `expense-tracker-categories`.
- All screens read from and write to localStorage, so your data is always up to date and persists across page reloads and navigation.
- The app listens for `storage` events to sync data across tabs and screens in real time.

#### How to Clear or Reset Local Storage

If you want to reset your data or start fresh:

1. **In your browser, open the Developer Tools** (usually F12 or right-click → Inspect).
2. Go to the **Application** (Chrome) or **Storage** (Firefox) tab.
3. Find **Local Storage** in the sidebar and select your app's domain.
4. Delete the following keys (or click 'Clear All'):
   - `expense-tracker-accounts`
   - `expense-tracker-transactions`
   - `expense-tracker-categories`
5. Refresh the app. All data will be reset.

Alternatively, you can run this in the browser console:

```js
localStorage.removeItem("expense-tracker-accounts");
localStorage.removeItem("expense-tracker-transactions");
localStorage.removeItem("expense-tracker-categories");
```

Then refresh the page.

### Main Screens

- **Home**: Quick overview of accounts and transactions. Add new accounts or transactions. Data is always loaded from localStorage.
- **Accounts**: View, add, and edit accounts. Changes are saved to localStorage and reflected everywhere.
- **Expense & Income**: Add new transactions (expense or income). Only possible if at least one account exists.
- **Reports**: (Placeholder for future features such as charts and summaries.)

### Forms & Validation

- **AccountForm**: Used for adding/editing accounts. Validates required fields.
- **AddTransactionForm**: Used for adding transactions. Validates that at least one account exists before allowing submission.
- **Error Messages**: User-friendly error messages are shown if validation fails (e.g., trying to add a transaction with no accounts).

### State Management & Sync

- All screens use React hooks (`useState`, `useEffect`) to manage and sync state with localStorage.
- When data changes, it is immediately saved to localStorage and the UI updates.
- The app listens for `storage` events to update state if data changes in another tab or screen.
- When adding or editing, the latest data is always fetched from localStorage to prevent overwriting changes.

## How to Use

1. **Install dependencies**:
   ```sh
   npm install
   ```
2. **Start the app**:
   ```sh
   npm run dev
   ```
3. **Navigate**:
   - Use the side menu to switch between Home, Accounts, Expense & Income, and Reports.
   - Add accounts and transactions as needed.
   - Data will persist across refreshes and navigation.

## File Structure

- `src/routes/Home.jsx` — Home screen, shows accounts/transactions, add forms, localStorage sync, validation.
- `src/routes/Accounts.jsx` — Accounts screen, table of accounts, add/edit, localStorage sync.
- `src/routes/ExpenseIncome.jsx` — Expense & Income screen, add transaction forms, localStorage sync, validation.
- `src/components/AccountForm.jsx` — Reusable account form.
- `src/components/AddTransactionForm.jsx` — Reusable transaction form.
- `src/routes/Home.css`, `src/routes/Accounts.css`, `src/routes/ExpenseIncome.css` — Modern, responsive styles.

## Customization & Extending

- You can add more account types, transaction fields, or reporting features as needed.
- The code is modular and easy to extend for new screens or features.

## Known Limitations

- No backend: all data is stored in the browser (localStorage).
- No authentication or user accounts.
- Reports screen is a placeholder for future analytics features.

## Credits

- Built with React, Vite, and modern CSS.
- Designed for learning and personal finance tracking.

---

Feel free to customize and extend this app for your own needs!
