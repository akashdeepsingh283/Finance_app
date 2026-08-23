import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Budget name is required."],
      trim: true,
      maxlength: [100, "Budget name cannot exceed 100 characters."],
    },
    amount: {
      type: Number,
      required: [true, "Budget amount is required."],
      min: [0, "Budget amount cannot be negative."],
    },
    icon: {
      type: String,
      trim: true,
      maxlength: [32, "Budget icon cannot exceed 32 characters."],
      default: "💰",
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

budgetSchema.index({ user: 1, createdAt: -1 });

export const Budget = mongoose.model("Budget", budgetSchema);
