import Transaction from "../models/Transaction.model.js";
import User from "../models/user.model.js";

const dashboardData = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const baseIncome = user.income || 0;

    // Current month range
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59
    );

    // Fetch current month transactions
    const monthlyTransactions = await Transaction.find({
      userId,
      createdAt: { $gte: startOfMonth, $lte: endOfMonth },
    }).sort({ createdAt: -1 });

    // Fetch all history for transaction list
    const allTransactions = await Transaction.find({ userId }).sort({
      createdAt: -1,
    });

    // Additional income this month
    const additionalIncome = monthlyTransactions
      .filter((t) => t.type === "income")
      .reduce((acc, t) => acc + t.amount, 0);

    // Expenses this month
    const expenses = monthlyTransactions
      .filter((t) => t.type === "expense")
      .reduce((acc, t) => acc + t.amount, 0);

    // Total income this month = salary + extra incomes
    const totalIncome = baseIncome + additionalIncome;

    // Carry over balance from previous months (exclude salary because it is monthly)
    const prevTransactions = await Transaction.find({
      userId,
      createdAt: { $lt: startOfMonth },
    });

    const prevIncome = baseIncome + prevTransactions
      .filter((t) => t.type === "income")
      .reduce((acc, t) => acc + t.amount, 0);

    const prevExpenses = prevTransactions
      .filter((t) => t.type === "expense")
      .reduce((acc, t) => acc + t.amount, 0);

    // Balance from all previous months
    const prevBalance = prevIncome - prevExpenses;

    // Final balance = last month balance + salary for this month + additional incomes − expenses
    const balance = prevBalance + baseIncome + additionalIncome - expenses;

    // Categories for pie (this month only)
    const categoriesMap = {};
    monthlyTransactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        categoriesMap[t.category] = (categoriesMap[t.category] || 0) + t.amount;
      });

    const categories = Object.keys(categoriesMap).map((key) => ({
      name: key,
      value: categoriesMap[key],
    }));

    res.json({
      balance,
      income: totalIncome,
      baseIncome,
      additionalIncome,
      expenses,
      transactions: allTransactions, // full history for list
      categories, // pie chart only uses current month
    });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching dashboard data",
      error: err.message,
    });
  }
};

export default dashboardData;
