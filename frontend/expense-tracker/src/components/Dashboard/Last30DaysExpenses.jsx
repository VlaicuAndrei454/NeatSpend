import React, { useEffect, useState } from "react";
import CustomBarChart from "../Charts/CustomBarChart";
import { prepareExpenseBarChartData } from "../../utils/helper";
import { LuWalletMinimal , LuTrendingUp } from "react-icons/lu";
import { FaChartBar } from "react-icons/fa";

const Last30DaysExpenses = ({ data }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
   const result = prepareExpenseBarChartData(data);
   setChartData(result);

    return () => {};
  }, [data]);

  return (
    <div className="card col-span-1">
      <div className="flex items-center justify-between ">
        <h5 className="text-lg">Last 30 Days Expenses</h5>
      </div>

      {(!data || data.length === 0 )&& (
              <div className="flex flex-col items-center justify-center text-center py-6 flex-grow">
                <p className="text-gray-500 mb-1">No expenses recorded yet.</p>
                <p className="text-sm text-gray-400">Once you start tracking your expenses, a bar chart will appear here.</p>
              </div>
            )}

      <CustomBarChart data={chartData} />
    </div>
  );
};

export default Last30DaysExpenses;
