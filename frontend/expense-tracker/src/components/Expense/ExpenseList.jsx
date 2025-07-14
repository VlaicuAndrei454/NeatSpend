import React from "react";
import TransactionInfoCard from "../Cards/TransactionInfoCard";
import moment from "moment";
import { LuDownload, LuHandCoins } from "react-icons/lu";

const ExpenseList = ({ transactions, onDelete, onDownload }) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">All Expenses</h5>

        <button className="card-btn" onClick={onDownload}>
          <LuDownload className="text-base" /> Download
        </button>
      </div>

      {(!transactions || transactions.length === 0) ? (
        <div className="flex flex-col items-center justify-center text-center py-10">
          <LuHandCoins className="text-5xl text-gray-300 mb-4" />
          <p className="text-gray-500">No expenses have been recorded.</p>
          <p className="text-sm text-gray-400 mt-1">
            Use the "Add Expense" button to start tracking.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 mt-4">
          {transactions?.map((expense) => (
            <TransactionInfoCard
              key={expense._id}
              title={expense.name} // Use expense.name for title
              category={expense.category} // Pass category
              icon={expense.icon}
              date={moment(expense.date).format("Do MMM YYYY")}
              amount={expense.amount}
              type="expense"
              onDelete={() => onDelete(expense._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ExpenseList;