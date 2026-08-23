import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { Button } from "./ui/Button";

function getDisplayName(user) {
  if (!user) return "";

  return (
    user.name ||
    user.username ||
    user.firstName ||
    user.email?.split("@")[0] ||
    user.email ||
    ""
  );
}

function Header({
  dashboardPath = "/dashboard",
  loginPath = "/sign-in",
  logoSrc = "/logo.svg",
}) {
  const { user, logout, isAuthenticated } = useAuth();
  const displayName = getDisplayName(user);

  return (
    <header className="flex items-center justify-between border-2 border-[#eeebff] bg-[#eeebff] p-5 shadow-lg">
      <Link to="/" aria-label="Expense Tracker home">
        <img src={logoSrc} alt="Expense Tracker" className="h-auto w-40" />
      </Link>

      {isAuthenticated ? (
        <div className="flex items-center gap-3">
          {displayName && (
            <span className="hidden text-sm font-medium text-slate-700 sm:inline">
              Hi, {displayName}
            </span>
          )}
          <Button variant="outline" size="sm" asChild>
            <Link to={dashboardPath}>Dashboard</Link>
          </Button>
          <Button size="sm" onClick={logout}>
            Log out
          </Button>
        </div>
      ) : (
        <Button asChild>
          <Link to={loginPath}>Get Started</Link>
        </Button>
      )}
    </header>
  );
}

export { Header };
export default Header;
