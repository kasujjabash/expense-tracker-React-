
import './ExpenseIncome.css';

const ExpenseIncome = () => (
  <div className="ei-root">
    <h2 className="ei-title">Expense & income</h2>
    <div className="ei-actions">
      <button className="ei-btn">Add New Income</button>
      <button className="ei-btn">Add New Expense</button>
    </div>
    <div className="ei-card-area">
      <div className="ei-empty">
        <div className="ei-empty-title">You have no expenses</div>
        <div className="ei-empty-desc">You haven't added any expenses. Tap the buttons above to start tracking your spending!</div>
      </div>
    </div>
  </div>
);

export default ExpenseIncome;
