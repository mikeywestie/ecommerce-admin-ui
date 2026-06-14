import { Menu } from "lucide-react";
import { useLocation } from "react-router-dom";

const pageTitles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/orders": "Orders",
  "/admin/payments": "Payments",
  "/admin/inventory": "Inventory",
  "/admin/system-health": "System Health",
  "/customer/products": "Products",
  "/customer/cart": "Cart",
  "/customer/checkout": "Checkout",
  "/customer/order-success": "Order Success",
};

type HeaderProps = {
  onMenuClick: () => void;
};

export default function Header({ onMenuClick }: HeaderProps) {
  const location = useLocation();
  const role = localStorage.getItem("role");
  const email = localStorage.getItem("email");

  const title =
    pageTitles[location.pathname] ||
    (location.pathname.startsWith("/customer/products/") ? "Product Details" : "E-Commerce Demo");

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-slate-800 bg-slate-900/95 backdrop-blur flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden rounded-xl border border-slate-700 bg-slate-800 p-2 text-slate-200 hover:bg-slate-700"
          aria-label="Open navigation menu"
        >
          <Menu size={20} />
        </button>

        <div className="min-w-0">
          <h2 className="text-lg md:text-xl font-semibold truncate">{title}</h2>
          <p className="text-xs text-slate-500">
            {role === "ADMIN" ? "Admin experience" : "Customer experience"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right hidden md:block">
          <p className="text-sm text-slate-300">{email}</p>
          <p className="text-xs text-slate-500">{role}</p>
        </div>

        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-sm font-bold shrink-0">
          {email?.charAt(0).toUpperCase() || "U"}
        </div>
      </div>
    </header>
  );
}
