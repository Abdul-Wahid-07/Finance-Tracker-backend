import Transaction from "../models/Transaction.model.js";

// Add new transaction
const addTransaction = async (req, res) => {
  try {
    const { description, amount, type, category } = req.body;

    const newTransaction = new Transaction({
      userId: req.user.userId,
      description,
      amount,
      type,
      category,
    });

    await newTransaction.save();
    res.status(201).json({ message: "Transaction added successfully", transaction: newTransaction });
  } catch (err) {
    res.status(500).json({ message: "Error adding transaction", error: err.message });
  }
};

// DELETE
const deleteTransaction = async (req, res) => {
  try {
    // const userId = req.userID;
    const transactionId = req.params.id;

    const transaction = await Transaction.findOneAndDelete({
      _id: transactionId,
      // user: userId,
    });

    if (!transaction) return res.status(404).json({ message: "Transaction not found" });

    res.json({ message: "Transaction deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE
const updateTransaction = async (req, res) => {
  try {
    // const userId = req.userID;
    const transactionId = req.params.id;
    const { description, amount, type, category } = req.body;

    const transaction = await Transaction.findOneAndUpdate(
      { _id: transactionId, },
      { description, amount, type, category },
      { new: true }
    );

    if (!transaction) return res.status(404).json({ message: "Transaction not found" });

    res.json(transaction);
  } catch (err) {
    res.status(500).json({ message: "Error",});
  }
};

export default { addTransaction, deleteTransaction, updateTransaction };
