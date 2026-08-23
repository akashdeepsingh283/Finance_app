import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function BarChartDash({ budgetList = [] }) {
  const chartData = (Array.isArray(budgetList) ? budgetList : []).map((budget) => ({
    ...budget,
    name: budget?.name || "Untitled",
    amount: toNumber(budget?.amount),
    totalSpend: toNumber(budget?.totalSpend),
  }));

  return (
    <section>
      <h2 className="ml-2 text-lg font-bold">Activity</h2>
      <div className="rounded-lg border-2 border-primary bg-violet-100 p-5 shadow-md">
        {chartData.length ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="totalSpend" stackId="a" fill="#4845D2" name="Spent" />
              <Bar dataKey="amount" stackId="a" fill="#C3C2FF" name="Budget" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-[300px] items-center justify-center text-sm text-slate-500">
            Add a budget to see your activity.
          </div>
        )}
      </div>
    </section>
  );
}

export { BarChartDash };
export default BarChartDash;
