// filepath: frontend/expense-tracker/src/components/Dashboard/ExpenseTransactions.jsx
import moment from "moment";
import React from "react";
import { LuArrowRight } from "react-icons/lu";
import { LuHandCoins } from "react-icons/lu";
import TransactionInfoCard from "../Cards/TransactionInfoCard";

const ExpenseTransactions = ({transactions, onSeeMore}) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between ">
        <h5 className="text-lg">Expenses</h5>

        <button className="card-btn" onClick={onSeeMore}>
          See All <LuArrowRight className="text-base" />
        </button>
      </div>

      {(!transactions || transactions.length === 0 )&& (
              <div className="flex flex-col items-center justify-center text-center py-6 flex-grow">
                <LuHandCoins className="text-4xl text-gray-300 mb-3" />
                <p className="text-gray-500 mb-1">No expenses recorded yet.</p>
                <p className="text-sm text-gray-400">Start tracking your expenses here.</p>
              </div>
            )}

      <div className="mt-6">
        {transactions?.slice(0,5)?.map((expense) => (
          <TransactionInfoCard
            key={expense._id}
            title={expense.name} // Use expense.name for title
            category={expense.category} // Pass category
            icon={expense.icon}
            date={moment(expense.date).format("Do MMM YYYY")}
            amount={expense.amount}
            type="expense"
            hideDeleteBtn
          />
        ))}
      </div>
    </div>
  );
};

export default ExpenseTransactions;