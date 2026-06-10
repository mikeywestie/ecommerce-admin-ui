import {
  Activity,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Package,
  ShoppingBag,
  ShoppingCart,
  X,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

import { logout } from "../services/authService";

const adminMenuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: ShoppingCart, label: "Orders", path: "/admin/orders" },
  { icon: CreditCard, label: "Payments", path: "/admin/payments" },
  { icon: Package, label: "Inventory", path: "/admin/inventory" },
  { icon: Activity, label: "System Health", path: "/admin/system-health" },
  { icon: ShoppingBag, label: "Storefront", path: "/customer/products" },
];

const customerMenuItems = [
  { icon: ShoppingBag, label: "Products", path: "/customer/products" },
  { icon: ShoppingCart, label: "Cart", path: "/customer/cart" },
  { icon: CreditCard, label: "Checkout", path: "/customer/checkout" },
];

type SidebarProps = {
  open: boolean;
  onClose: () => void;
};

export default function Sidebar({ open, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const email = localStorage.getItem("email");

  const isAdmin = role === "ADMIN";
  const menuItems = isAdmin ? adminMenuItems : customerMenuItems;

  function handleLogout() {
    logout();
    onClose();
    navigate("/login");
  }

  return (
    <>
      {open && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={onClose}
          aria-label="Close navigation backdrop"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-72 max-w-[82vw] bg-slate-950 border-r border-slate-800 p-4 flex flex-col transform transition-transform duration-300 lg:w-64 lg:max-w-none ${
          open ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="mb-8 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-white">
              {isAdmin ? "Ecommerce Admin" : "Ecommerce Store"}
            </h1>

            <p className="text-xs text-slate-500 mt-2 truncate">
              {email || "Signed in"}
            </p>

            <span className="mt-3 inline-flex rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-300">
              {isAdmin ? "Admin Portal" : "Customer Portal"}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="lg:hidden rounded-xl border border-slate-800 bg-slate-900 p-2 text-slate-300 hover:bg-slate-800"
            aria-label="Close navigation menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="space-y-2 flex-1 overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              end={item.path === "/admin" || item.path === "/customer/products"}
              onClick={onClose}
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

        <div className="pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3 rounded-xl transition text-red-400 hover:bg-red-500/20"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}