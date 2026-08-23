import { Outlet } from "react-router-dom";
import SideNav from "../components/dashboard/SideNav";
import DashboardHeader from "../components/dashboard/DashboardHeader";

export default function DashboardLayout() {
  return (
    <div>
      <aside className="fixed hidden md:block md:w-64">
        <SideNav />
      </aside>
      <main className="min-h-screen md:ml-64">
        <DashboardHeader />
        <Outlet />
      </main>
    </div>
  );
}
