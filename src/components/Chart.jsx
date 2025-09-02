import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);


// Group expenses by category for the current month and collect color
function getCategoryDataAndColors(data, categories) {
  const categoryTotals = {};
  const categoryColors = {};
  data.forEach(t => {
    if (t.type === 'Expense') {
      const catName = t.category?.name || 'Uncategorized';
      categoryTotals[catName] = (categoryTotals[catName] || 0) + parseFloat(t.amount || 0);
      // Find color from categories array
      if (!categoryColors[catName]) {
        const found = categories?.find(c => c.name === catName);
        categoryColors[catName] = found?.color || '#cccccc';
      }
    }
  });
  return { categoryTotals, categoryColors };
}

// Chart now takes categories prop
const Chart = ({ data, title, categories = [] }) => {
  const { categoryTotals, categoryColors } = getCategoryDataAndColors(data, categories);
  const labels = Object.keys(categoryTotals);
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Expenses by Category',
        data: Object.values(categoryTotals),
        backgroundColor: labels.map(label => categoryColors[label] || '#cccccc'),
        borderWidth: 1,
      },
    ],
  };
  const options = {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'right' },
      tooltip: { enabled: true },
      title: { display: !!title, text: title },
    },
    maintainAspectRatio: false,
  };
  return (
    <div style={{ width: '100%', height: 340 }}>
      <Pie data={chartData} options={options} height={340} />
    </div>
  );
};

export default Chart;
