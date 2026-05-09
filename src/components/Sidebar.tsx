import {
  LayoutDashboard,
  ShoppingCart,
  CreditCard,
  Package,
  Activity,
  LogOut,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

import { logout } from "../services/authService";

const menuItems = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    path: "/",
  },
  {
    icon: ShoppingCart,
    label: "Orders",
    path: "/orders",
  },
  {
    icon: CreditCard,
    label: "Payments",
    path: "/payments",
  },
  {
    icon: Package,
    label: "Inventory",
    path: "/inventory",
  },
  {
    icon: Activity,
    label: "System Health",
    path: "/system-health",
  },
];

export default function Sidebar() {
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-950 border-r border-slate-800 p-4 flex flex-col">
      {/* Logo / Title */}
      <h1 className="text-2xl font-bold mb-8 text-white">
        Ecommerce Admin
      </h1>

      {/* Navigation */}
      <nav className="space-y-2 flex-1 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-xl transition ${
                isActive
                  ? "bg-slate-700 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`
            }
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="pt-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 p-3 rounded-xl transition text-red-400 hover:bg-red-500/20"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}