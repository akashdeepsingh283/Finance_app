import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/input";

export default function SignUpPage() {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [values, setValues] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await register(values);
      navigate("/dashboard", { replace: true });
    } catch (requestError) {
      setError(requestError.message || "Unable to create your account.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-white">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        <section className="relative flex h-32 items-end bg-gray-900 lg:col-span-5 lg:h-full xl:col-span-6">
          <img
            alt="Finance"
            src="/finance-for-non-finance-course.jpeg"
            className="absolute inset-0 h-full w-full object-cover opacity-80"
          />
          <div className="relative z-10 hidden lg:block lg:p-12">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Welcome to Expense Tracker</h2>
            <p className="mt-4 text-lg leading-relaxed text-white/90">
              Organize your expenses, visualize your budget, and grow your savings with ease.
            </p>
          </div>
        </section>
        <main className="flex items-center justify-center px-6 py-12 sm:px-12 lg:col-span-7 xl:col-span-6">
          <div className="w-full max-w-md space-y-6">
            <div className="text-center lg:hidden">
              <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Welcome to Expense Tracker</h1>
              <p className="mt-3 text-gray-600">Create an account and take charge of every dollar.</p>
            </div>
            <div className="rounded-lg border border-slate-200 p-6 shadow-sm sm:p-8">
              <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
              <p className="mt-1 text-sm text-gray-600">Start tracking your budgets in a few seconds.</p>
              <form className="mt-6 space-y-4" onSubmit={submit}>
                <label className="block text-sm font-medium text-gray-800">
                  Name
                  <Input
                    className="mt-1"
                    autoComplete="name"
                    value={values.name}
                    onChange={(event) => setValues((current) => ({ ...current, name: event.target.value }))}
                    required
                  />
                </label>
                <label className="block text-sm font-medium text-gray-800">
                  Email
                  <Input
                    className="mt-1"
                    type="email"
                    autoComplete="email"
                    value={values.email}
                    onChange={(event) => setValues((current) => ({ ...current, email: event.target.value }))}
                    required
                  />
                </label>
                <label className="block text-sm font-medium text-gray-800">
                  Password
                  <Input
                    className="mt-1"
                    type="password"
                    autoComplete="new-password"
                    minLength="6"
                    value={values.password}
                    onChange={(event) => setValues((current) => ({ ...current, password: event.target.value }))}
                    required
                  />
                </label>
                {error && <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}
                <Button className="w-full" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating account…" : "Create account"}
                </Button>
              </form>
              <p className="mt-5 text-center text-sm text-gray-600">
                Already have an account? <Link className="font-medium text-primary hover:underline" to="/sign-in">Sign in</Link>
              </p>
            </div>
          </div>
        </main>
      </div>
    </section>
  );
}
