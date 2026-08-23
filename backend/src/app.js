import cors from "cors";
import express from "express";
import morgan from "morgan";
import mongoose from "mongoose";
import { getDashboard } from "./controllers/dashboardController.js";
import { requireAuth } from "./middleware/auth.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import { authRouter } from "./routes/authRoutes.js";
import { budgetRouter } from "./routes/budgetRoutes.js";
import { expenseRouter } from "./routes/expenseRoutes.js";

const app = express();
const allowedOrigins = (process.env.CLIENT_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Allow requests with no origin (e.g. curl, mobile apps) and all
      // origins in development. In production, only allow the configured
      // CLIENT_ORIGIN values.
      if (
        !origin ||
        process.env.NODE_ENV !== "production" ||
        allowedOrigins.length === 0 ||
        allowedOrigins.includes(origin)
      ) {
        return callback(null, true);
      }

      return callback(new Error("This origin is not allowed by CORS."));
    },
  }),
);
app.use(express.json({ limit: "1mb" }));

if (process.env.NODE_ENV !== "test") {
  app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
}

app.get("/api/health", (req, res) => {
  const databaseStates = ["disconnected", "connected", "connecting", "disconnecting"];
  res.json({
    status: "ok",
    database: databaseStates[mongoose.connection.readyState] || "unknown",
  });
});

app.get("/api/dashboard", requireAuth, getDashboard);
app.use("/api/auth", authRouter);
app.use("/api/budgets", budgetRouter);
app.use("/api/expenses", expenseRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
