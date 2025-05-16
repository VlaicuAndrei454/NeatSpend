import React from "react";
import moment from "moment";
import { LuRepeat } from "react-icons/lu";
import TransactionInfoCard from "../cards/TransactionInfoCard";

const SubscriptionList = ({ subscriptions, onDelete }) => (
  <div className="grid grid-cols-1 gap-4">
    {subscriptions.map((sub) => (
      <TransactionInfoCard
        key={sub._id}
        icon={<LuRepeat />}
        title={sub.name}
        date={moment(sub.nextBillingDate).format("Do MMM YYYY")}
        amount={sub.amount}
        type="expense"
        onDelete={() => onDelete(sub._id)}
      />
    ))}
  </div>
);

export default SubscriptionList;
