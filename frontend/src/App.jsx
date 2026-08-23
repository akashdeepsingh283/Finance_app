import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./context/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import HomePage from "./pages/HomePage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import DashboardPage from "./pages/DashboardPage";
import BudgetsPage from "./pages/BudgetsPage";
import ExpensesPage from "./pages/ExpensesPage";
import BudgetExpensesPage from "./pages/BudgetExpensesPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/sign-in" element={<SignInPage />} />
      <Route path="/sign-up" element={<SignUpPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="budgets" element={<BudgetsPage />} />
          <Route path="expense" element={<ExpensesPage />} />
          <Route path="expenses/:id" element={<BudgetExpensesPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
