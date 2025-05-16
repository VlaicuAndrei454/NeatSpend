// src/pages/Dashboard/Expense.jsx

import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../../hooks/useUserAuth";
import { useCurrency } from "../../hooks/useCurrency";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import ExpenseOverview from "../../components/Expense/ExpenseOverview";
import ExpenseList from "../../components/Expense/ExpenseList";
import AddExpenseForm from "../../components/Expense/AddExpenseForm";
import DeleteAlert from "../../components/DeleteAlert";
import Modal from "../../components/Modal";
import toast from "react-hot-toast";
import ForecastChart from "../../components/Expense/ForecastChart";

const Expense = () => {
  useUserAuth();
  const { formatCurrency } = useCurrency();
  const navigate = useNavigate();

  const [expenseData, setExpenseData] = useState([]);
  const [forecast, setForecast]       = useState(null);
  const [loading, setLoading]         = useState(false);
  const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert]         = useState({ show: false, data: null });

  // Fetch all expenses
  const fetchExpenseDetails = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await axiosInstance.get(API_PATHS.EXPENSE.GET_ALL_EXPENSE);
      if (res.data) setExpenseData(res.data);
    } catch (err) {
      console.error("Error fetching expenses:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch forecast for current month
  const fetchForecast = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.EXPENSE.FORECAST);
      if (res.data) setForecast(res.data);
    } catch (err) {
      console.error(
        "Error fetching expense forecast:",
        err.response?.data?.message || err.message
      );
    }
  };

  // Add expense
  const handleAddExpense = async (expense) => {
    const { category, amount, date, icon } = expense;
    if (!category.trim()) {
      toast.error("Category is required.");
      return;
    }
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error("Amount should be a valid number greater than 0.");
      return;
    }
    if (!date) {
      toast.error("Date is required.");
      return;
    }

    try {
      await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, {
        category,
        amount,
        date,
        icon,
      });
      toast.success("Expense added successfully");
      setOpenAddExpenseModal(false);
      await fetchExpenseDetails();
      await fetchForecast();
    } catch (error) {
      console.error(
        "Error adding expense:",
        error.response?.data?.message || error.message
      );
    }
  };

  // Delete expense
  const deleteExpense = async (id) => {
    try {
      await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id));
      toast.success("Expense deleted successfully");
      setOpenDeleteAlert({ show: false, data: null });
      await fetchExpenseDetails();
      await fetchForecast();
    } catch (error) {
      console.error(
        "Error deleting expense:",
        error.response?.data?.message || error.message
      );
    }
  };

  // Download expense details
  const handleDownloadExpenseDetails = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.EXPENSE.DOWNLOAD_EXPENSE,
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "expense_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading expense details:", error);
      toast.error("Failed to download expense details. Please try again.");
    }
  };

  

  const buildForecastChartData = () => {
    if (!forecast) return [];
  
    // 1. Filter for current month & year
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear  = today.getFullYear();
    const thisMonthExpenses = expenseData.filter(({ date }) => {
      const d = new Date(date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });
  
    const { totalDaysInMonth, averageDaily, daysSoFar } = forecast;
  
    // 2. Bucket by day-of-month
    const byDay = thisMonthExpenses.reduce((acc, { date, amount }) => {
      const day = parseInt(date.split("T")[0].split("-")[2], 10);
      acc[day] = (acc[day] || 0) + amount;
      return acc;
    }, {});
  
    // 3. Build cumulative + forecast array
    const data = [];
    let cumActual = 0;
    for (let day = 1; day <= totalDaysInMonth; day++) {
      if (byDay[day]) cumActual += byDay[day];
      data.push({
        day,
        actual: day <= daysSoFar ? cumActual : null,
        forecast:
          day > daysSoFar
            ? +(
                cumActual +
                averageDaily * (day - daysSoFar)
              ).toFixed(2)
            : null,
      });
    }
  
    return data;
  };
  

  useEffect(() => {
    if (!expenseData.length) return;
  
    // Find any expenses that your chart logic will map to day 4
    const entriesOnDay4 = expenseData.filter(({ date, amount }) => {
      // parse day-of-month straight from the ISO date
      const d = parseInt(date.split("T")[0].split("-")[2], 10);
      return d === 4;
    });
  
    console.group("🕵️‍♀️ Debug Day 4 Entries");
    console.log("Raw expenseData:", expenseData);
    console.log("Entries parsed as day 4:", entriesOnDay4);
    console.groupEnd();
  }, [expenseData]);
  
  

  const chartData = buildForecastChartData();

  useEffect(() => {
    console.log("Forecast chartData:", chartData);
  }, [chartData]);

  useEffect(() => {
    fetchExpenseDetails();
    fetchForecast();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DashboardLayout activeMenu="Expense">
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 gap-6">
          {/* Forecast Summary Card */}
          {forecast && (
            <div className="card">
              <h5 className="text-lg mb-2">
                Expense Forecast for{" "}
                {new Date().toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}
              </h5>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="font-medium">Spent so far</p>
                  <p>{formatCurrency(forecast.totalSpent)}</p>
                </div>
                <div>
                  <p className="font-medium">Avg. per day</p>
                  <p>{formatCurrency(forecast.averageDaily)}</p>
                </div>
                <div>
                  <p className="font-medium">Days passed</p>
                  <p>
                    {forecast.daysSoFar}/{forecast.totalDaysInMonth}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Projected total</p>
                  <p>{formatCurrency(forecast.forecast)}</p>
                </div>
              </div>
            </div>
          )}

          {/* Forecast Chart */}
          {forecast && <ForecastChart data={chartData} />}

          {/* Expense Overview & List */}
          <ExpenseOverview
            transactions={expenseData}
            onExpenseIncome={() => setOpenAddExpenseModal(true)}
          />

          <ExpenseList
            transactions={expenseData}
            onDelete={(id) => setOpenDeleteAlert({ show: true, data: id })}
            onDownload={handleDownloadExpenseDetails}
          />

          {/* Add Expense Modal */}
          <Modal
            isOpen={openAddExpenseModal}
            onClose={() => setOpenAddExpenseModal(false)}
            title="Add Expense"
          >
            <AddExpenseForm onAddExpense={handleAddExpense} />
          </Modal>

          {/* Delete Expense Modal */}
          <Modal
            isOpen={openDeleteAlert.show}
            onClose={() => setOpenDeleteAlert({ show: false, data: null })}
            title="Delete Expense"
          >
            <DeleteAlert
              content="Are you sure you want to delete this expense?"
              onDelete={() => deleteExpense(openDeleteAlert.data)}
            />
          </Modal>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Expense;
