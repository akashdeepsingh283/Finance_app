import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Expense name is required."],
      trim: true,
      maxlength: [100, "Expense name cannot exceed 100 characters."],
    },
    amount: {
      type: Number,
      required: [true, "Expense amount is required."],
      min: [0, "Expense amount cannot be negative."],
    },
    expenseDate: {
      type: Date,
      default: Date.now,
    },
    budget: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Budget",
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true },
);

expenseSchema.index({ user: 1, expenseDate: -1 });
expenseSchema.index({ budget: 1, expenseDate: -1 });

export const Expense = mongoose.model("Expense", expenseSchema);
