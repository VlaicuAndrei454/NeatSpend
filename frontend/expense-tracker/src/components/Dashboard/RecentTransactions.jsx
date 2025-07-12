// filepath: frontend/expense-tracker/src/components/Dashboard/RecentTransactions.jsx
import React from "react";
import TransactionInfoCard from "../cards/TransactionInfoCard";
import { LuArrowRight, LuReceipt } from "react-icons/lu";
import moment from "moment";

const RecentTransactions = ({transactions, onSeeMore}) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between ">
        <h5 className="text-lg">Recent Transactions</h5>

        <button className="card-btn" onClick={onSeeMore}>
          See All <LuArrowRight className="text-base" />
        </button>
      </div>

      {(!transactions || transactions.length === 0 )&& (
              <div className="flex flex-col items-center justify-center text-center py-6 flex-grow">
                <LuReceipt className="text-4xl text-gray-300 mb-3" />
                <p className="text-gray-500 mb-1">No transactions recorded yet.</p>
                <p className="text-sm text-gray-400">Your transactions will appear here once you start tracking them.</p>
              </div>
            )}

      <div className="mt-6">
        {transactions?.slice(0,5)?.map((item) => (
          <TransactionInfoCard
            key={item._id}
            title={item.type === 'expense' ? item.name : item.source} // Use item.name for expense
            category={item.type === 'expense' ? item.category : undefined} // Pass category for expense
            icon={item.icon}
            date={moment(item.date).format("Do MMM YYYY")}
            amount={item.amount}
            type={item.type}
            hideDeleteBtn
          />
        ))}
      </div>
    </div>
  );
};

export default RecentTransactions;