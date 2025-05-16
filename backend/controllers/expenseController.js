const xlsx = require('xlsx');
const Expense = require("../models/Expense");

// Add Expense
exports.addExpense = async (req, res) => {
  const userId = req.user.id;

  try {
    const { icon, category, amount, date } = req.body;

    // Validation: Check for missing fields
    if (!category || !amount || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newExpense = new Expense({
      userId,
      icon,
      category,
      amount,
      date: new Date(date),
    });

    await newExpense.save();
    res.status(200).json(newExpense);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Get All Expenses (For Logged-in User)
exports.getAllExpenses = async (req, res) => {
  const userId = req.user.id;

  try {
    const expenses = await Expense.find({ userId }).sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete Expense
exports.deleteExpense = async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Download Expense Details in Excel
exports.downloadExpenseExcel = async (req, res) => {
  const userId = req.user.id;
  try {
    const expense = await Expense.find({ userId }).sort({ date: -1 });

    // Prepare data for Excel
    const data = expense.map((item) => ({
      Category: item.category,
      Amount: item.amount,
      Date: item.date,
    }));
    
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, "Expense");
    xlsx.writeFile(wb, 'expense_details.xlsx');
    res.download('expense_details.xlsx');
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};


exports.forecastExpenses = async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();

    // 1) First day of current month
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    // 2) How many days have passed so far
    const daysSoFar = now.getDate();
    // 3) Total days in this month
    const totalDaysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

    // Fetch all expenses for this user between startOfMonth and today
    const expenses = await Expense.find({
      userId,
      date: { $gte: startOfMonth, $lte: now },
    });

    // Sum up amounts
    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
    // Average per day so far
    const averageDaily = daysSoFar > 0 ? totalSpent / daysSoFar : 0;
    // Project to full month
    const forecast = averageDaily * totalDaysInMonth;

    return res.json({
      totalSpent,
      averageDaily: +averageDaily.toFixed(2),
      daysSoFar,
      totalDaysInMonth,
      forecast: +forecast.toFixed(2),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server Error', error: err.message });
  }
};