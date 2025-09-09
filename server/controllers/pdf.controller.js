import PDFDocument from "pdfkit";
import path from "path";
import Transaction from "../models/Transaction.model.js";
import User from "../models/user.model.js";

export const generateReport = async (req, res) => {
  try {
    const userId = req.userID;
    if (!userId) {
      return res.status(400).json({ message: "User not found in token" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const transactions = await Transaction.find({ userId }).sort({
      createdAt: 1,
    });

    const doc = new PDFDocument({ margin: 50 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=report.pdf");
    doc.pipe(res);

    const fontPath = path.resolve("font/NotoSans-Regular.ttf");
    doc.font(fontPath);

    // Title
    doc.fontSize(20).text("Financial Report", { align: "center" });
    doc.moveDown();

    // User Info
    doc.fontSize(12).text(`User: ${user.username}`);
    doc.text(`Email: ${user.email}`);
    doc.moveDown();

    // Base income
    const default_income = user.income || 0;

    // Group transactions by month-year
    const grouped = {};
    transactions.forEach((t) => {
      const date = new Date(t.createdAt);
      const monthYear = date.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
      if (!grouped[monthYear]) {
        grouped[monthYear] = { income: [], expense: [] };
      }
      grouped[monthYear][t.type].push(t);
    });

    // Correct iteration
    for (const [monthYear, { income, expense }] of Object.entries(grouped).reverse()) {
      doc.fontSize(16).text(monthYear, { underline: true });
      doc.moveDown(0.5);

      // Calculate monthly totals
      const additionalIncome = income.reduce((acc, t) => acc + t.amount, 0);
      const monthlyIncome = additionalIncome + default_income;
      const monthlyExpense = expense.reduce((acc, t) => acc + t.amount, 0);
      const monthlyBalance = monthlyIncome - monthlyExpense;

      // Monthly Summary
      doc.fontSize(14).text("Monthly Summary", { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(12).text(`Base Income: ₹${default_income}`);
      doc.text(`Additional Income: ₹${additionalIncome}`);
      doc.text(`Total Income: ₹${monthlyIncome}`);
      doc.text(`Total Expense: ₹${monthlyExpense}`);
      doc.text(`Balance: ₹${monthlyBalance}`);
      doc.moveDown(1);

      // Income list
      if (income.length > 0) {
        doc.fontSize(14).text("Income Details", { underline: true });
        income.forEach((t, i) => {
          doc.fontSize(12).text(
            `${i + 1}. ${t.description} => +₹${t.amount} (${new Date(
              t.createdAt
            ).toLocaleDateString("en-US", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })})`
          );
        });
        doc.moveDown();
      }

      // Expense list
      if (expense.length > 0) {
        doc.fontSize(14).text("Expense Details", { underline: true });
        expense.forEach((t, i) => {
          doc.fontSize(12).text(
            `${i + 1}. ${t.description} => -₹${t.amount} (${new Date(
              t.createdAt
            ).toLocaleDateString("en-US", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })})`
          );
        });
        doc.moveDown();
      }

      // Divider
      doc.moveDown(1).text("------------------------------", {
        align: "center",
      });
      doc.moveDown(1);
    }

    doc.end();
  } catch (error) {
    console.error("PDF generation error:", error);
    if (!res.headersSent) {
      res
        .status(500)
        .json({ message: "Error generating PDF", error: error.message });
    }
  }
};
