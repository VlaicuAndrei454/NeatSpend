// src/components/Dashboard/FinanceOverview.jsx

import React from "react";
import CustomPieChart from "../Charts/CustomPieChart";
import { useCurrency } from "../../hooks/useCurrency";

// match the Home.jsx logos: green → balance, black → expenses, grey → income
const COLORS = [
  "#10b981", // green-500
  "#000000", // black
  "#71717a", // gray-500
];

const FinanceOverview = ({ totalBalance, totalIncome, totalExpense }) => {
  const { formatCurrency } = useCurrency();

  const balanceData = [
    { name: "Total Balance", amount: totalBalance },
    { name: "Total Expenses", amount: totalExpense },
    { name: "Total Income", amount: totalIncome },
  ];

  // If all amounts are zero, return null to avoid rendering an empty chart
  if (totalBalance === 0 && totalIncome === 0 && totalExpense === 0) {
    return (
      <div className="card">
        <div className="flex items-center justify-between">
          <h5 className="text-lg">Financial Overview</h5>
        </div>
        <div className="flex flex-col items-center justify-center text-center py-6 flex-grow">
          <p className="text-gray-500 mb-1">No financial data available.</p>
          <p className="text-sm text-gray-400">Start tracking your finances to see an overview here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Financial Overview</h5>
      </div>

      <CustomPieChart
        data={balanceData}
        totalAmount={formatCurrency(totalBalance)}
        colors={COLORS}
        showTextAnchor
      />
    </div>
  );
};

export default FinanceOverview;
