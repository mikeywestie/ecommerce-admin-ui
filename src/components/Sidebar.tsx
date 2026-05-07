import {
  LayoutDashboard,
  ShoppingCart,
  CreditCard,
  Package,
  Activity
} from "lucide-react";

import { NavLink } from "react-router-dom";

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
  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800 p-4">
      <h1 className="text-2xl font-bold mb-8 text-white">
        Ecommerce Admin
      </h1>

      <nav className="space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-xl transition
              ${
                isActive
                  ? "bg-slate-700"
                  : "hover:bg-slate-800"
              }`
            }
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}