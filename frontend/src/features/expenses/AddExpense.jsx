import { useState } from "react";
import { toast } from "sonner";
import { createExpense } from "../../api/finance";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/input";

export default function AddExpense({ budget, budgetId, refreshData }) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const numericAmount = Number(amount);
      await createExpense(budgetId, { name: name.trim(), amount: numericAmount });
      setName("");
      setAmount("");
      const projectedSpend = Number(budget?.totalSpend || 0) + numericAmount;
      toast.success(projectedSpend > Number(budget?.amount || 0)
        ? "New expense added — this budget is now overspent."
        : "New expense added!");
      await refreshData?.();
    } catch (error) {
      toast.error(error.message || "Unable to add the expense.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="rounded-lg border-2 border-primary p-5" onSubmit={submit}>
      <h2 className="text-lg font-bold">Add Expense</h2>
      <label className="mt-2 block text-sm font-medium text-black">
        Expense Name
        <Input className="mt-1" placeholder="e.g. Cleaner" value={name} onChange={(event) => setName(event.target.value)} required />
      </label>
      <label className="mt-2 block text-sm font-medium text-black">
        Expense Amount
        <Input className="mt-1" placeholder="e.g. 50" type="number" min="0.01" step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} required />
      </label>
      <Button className="mt-3 w-full" type="submit" disabled={!name.trim() || !Number(amount) || isSubmitting}>
        {isSubmitting ? "Adding…" : "Add New Expense"}
      </Button>
    </form>
  );
}
