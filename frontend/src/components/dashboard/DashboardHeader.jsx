import { LogOut } from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { Button } from "../ui/Button";

function getDisplayName(user) {
  if (!user) return "Account";

  return (
    user.name ||
    user.username ||
    user.firstName ||
    user.email?.split("@")[0] ||
    user.email ||
    "Account"
  );
}

function getInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function DashboardHeader() {
  const { user, logout, isAuthenticated } = useAuth();
  const displayName = getDisplayName(user);

  return (
    <header className="flex justify-end border-b-2 border-slate-300 p-5 shadow-sm">
      {isAuthenticated && (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
            {getInitials(displayName)}
          </div>
          <div className="hidden leading-tight sm:block">
            <p className="text-sm font-semibold text-slate-800">{displayName}</p>
            {user?.email && <p className="text-xs text-slate-500">{user.email}</p>}
          </div>
          <Button variant="outline" size="sm" onClick={logout}>
            <LogOut aria-hidden="true" />
            <span className="hidden sm:inline">Log out</span>
            <span className="sr-only sm:hidden">Log out</span>
          </Button>
        </div>
      )}
    </header>
  );
}

export { DashboardHeader };
export default DashboardHeader;
