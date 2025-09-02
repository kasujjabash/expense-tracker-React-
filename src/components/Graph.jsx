import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

// Group by day for current month
function getDailyIncomeExpense(data) {
  // Get all days in current month
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const income = Array(daysInMonth).fill(0);
  const expense = Array(daysInMonth).fill(0);
  data.forEach(t => {
    if (!t.date) return;
    const d = new Date(t.date);
    if (d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()) {
      const idx = d.getDate() - 1;
      if (t.type === 'Income') income[idx] += parseFloat(t.amount || 0);
      if (t.type === 'Expense') expense[idx] += parseFloat(t.amount || 0);
    }
  });
  return { days, income, expense };
}

const Graph = ({ data, title }) => {
  const { days, income, expense } = getDailyIncomeExpense(data);
  const chartData = {
    labels: days.map(d => d.toString()),
    datasets: [
      {
        label: 'Income',
        data: income,
        borderColor: '#08702b',
        backgroundColor: 'rgba(8,112,43,0.1)',
        tension: 0.3,
        fill: false,
        pointRadius: 2,
      },
      {
        label: 'Expense',
        data: expense,
        borderColor: '#b30000',
        backgroundColor: 'rgba(179,0,0,0.1)',
        tension: 0.3,
        fill: false,
        pointRadius: 2,
      },
    ],
  };
  const options = {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'top' },
      tooltip: { enabled: true },
      title: { display: !!title, text: title },
    },
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true },
      x: { title: { display: true, text: 'Day of Month' } },
    },
  };
  return (
    <div style={{ width: '100%', height: 340 }}>
      <Line data={chartData} options={options} height={340} />
    </div>
  );
};

export default Graph;
