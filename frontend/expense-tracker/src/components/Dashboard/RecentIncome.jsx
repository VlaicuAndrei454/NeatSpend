import React from "react";
import { LuArrowRight } from "react-icons/lu";
import TransactionInfoCard from "../Cards/TransactionInfoCard";
import moment from "moment";
import { LuWalletMinimal } from "react-icons/lu";

const RecentIncome = ({transactions, onSeeMore}) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between ">
        <h5 className="text-lg">Income</h5>

        <button className="card-btn" onClick={onSeeMore}>
          See All <LuArrowRight className="text-base" />
        </button>
      </div>

      {(!transactions || transactions.length === 0 )&& (
        <div className="flex flex-col items-center justify-center text-center py-6 flex-grow">
          <LuWalletMinimal className="text-4xl text-gray-300 mb-3" />
          <p className="text-gray-500 mb-1">No incomes recorded yet.</p>
          <p className="text-sm text-gray-400">Start tracking your incomes here.</p>
        </div>
      )}

      <div className="mt-6">
        {transactions?.slice(0,5)?.map((item) => (
          <TransactionInfoCard
            key={item._id}
            title={item.source}
            icon={item.icon}
            date={moment(item.date).format("Do MMM YYYY")}
            amount={item.amount}
            type="income"
            hideDeleteBtn
          />
        ))}
      </div>
    </div>
  );
};

export default RecentIncome;
