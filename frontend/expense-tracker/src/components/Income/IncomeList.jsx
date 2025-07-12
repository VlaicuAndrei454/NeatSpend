import React from "react";
import TransactionInfoCard from "../cards/TransactionInfoCard";
import moment from "moment";
import { LuDownload, LuWalletMinimal } from "react-icons/lu";

const IncomeList = ({ transactions, onDelete, onDownload }) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Income Sources</h5>

        <button className="card-btn" onClick={onDownload}>
          <LuDownload className="text-base" /> Download
        </button>
      </div>

      {(!transactions || transactions.length === 0) ? (
        <div className="flex flex-col items-center justify-center text-center py-10">
          <LuWalletMinimal className="text-5xl text-gray-300 mb-4" />
          <p className="text-gray-500">No income has been recorded.</p>
          <p className="text-sm text-gray-400 mt-1">
            Use the "Add Income" button to start tracking.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 mt-4">
          {transactions?.map((income) => (
            <TransactionInfoCard
              key={income._id}
              title={income.source}
              icon={income.icon}
              date={moment(income.date).format("Do MMM YYYY")}
              amount={income.amount}
              type="income"
              onDelete={() => onDelete(income._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default IncomeList;