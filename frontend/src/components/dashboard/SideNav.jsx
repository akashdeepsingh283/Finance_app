import { LayoutGrid, PiggyBank, ReceiptText } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const defaultMenuItems = [
  { id: "dashboard", name: "Dashboard", icon: LayoutGrid, path: "/dashboard" },
  { id: "budgets", name: "Budgets", icon: PiggyBank, path: "/dashboard/budgets" },
  {
    id: "expenses",
    name: "All Expenses",
    icon: ReceiptText,
    path: "/dashboard/expense",
  },
];

function isActivePath(currentPath, itemPath) {
  if (itemPath === "/dashboard") return currentPath === itemPath;
  return currentPath === itemPath || currentPath.startsWith(`${itemPath}/`);
}

function SideNav({ menuItems = defaultMenuItems, logoSrc = "/logo.svg" }) {
  const { pathname } = useLocation();

  return (
    <aside className="h-screen border-r-2 border-slate-300 p-5 shadow-sm">
      <Link to="/" aria-label="Expense Tracker home">
        <img src={logoSrc} alt="Expense Tracker" className="h-auto w-40" />
      </Link>

      <nav className="mt-5" aria-label="Dashboard navigation">
        {menuItems.map(({ id, name, icon: Icon, path }) => {
          const active = isActivePath(pathname, path);

          return (
            <Link key={id ?? path} to={path}>
              <span
                className={`mb-2 flex cursor-pointer items-center gap-2 rounded-md p-3 font-medium text-gray-900 hover:bg-blue-200 hover:text-primary ${
                  active ? "bg-blue-200 text-primary" : ""
                }`}
              >
                <Icon aria-hidden="true" />
                {name}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export { SideNav, defaultMenuItems };
export default SideNav;
