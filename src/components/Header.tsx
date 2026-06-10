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

export default function Header() {
  const location = useLocation();
  const role = localStorage.getItem("role");
  const email = localStorage.getItem("email");

  const title =
    pageTitles[location.pathname] ||
    (location.pathname.startsWith("/customer/products/")
      ? "Product Details"
      : "E-Commerce Demo");

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900 flex items-center justify-between px-6">
      <div>
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-xs text-slate-500">
          {role === "ADMIN" ? "Admin experience" : "Customer experience"}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-sm text-slate-300">{email}</p>
          <p className="text-xs text-slate-500">{role}</p>
        </div>

        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-sm font-bold">
          {email?.charAt(0).toUpperCase() || "U"}
        </div>
      </div>
    </header>
  );
}