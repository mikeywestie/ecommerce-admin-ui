import { AlertTriangle, CheckCircle2, ShoppingBag } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

type OrderResponse = {
  id: number;
  customerName: string;
  customerEmail: string;
  status: string;
  totalAmount: number;
  createdAt: string;
};

export default function OrderSuccess() {
  const location = useLocation();
  const order = location.state?.order as OrderResponse | undefined;

  const isPaymentFailed = order?.status === "PAYMENT_FAILED";

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
      {isPaymentFailed ? (
        <AlertTriangle className="mx-auto h-16 w-16 text-red-500 mb-4" />
      ) : (
        <CheckCircle2 className="mx-auto h-16 w-16 text-emerald-500 mb-4" />
      )}

      <h1 className="text-3xl font-bold text-slate-900">
        {isPaymentFailed ? "Payment Failed" : "Order Created Successfully"}
      </h1>

      <p className="text-slate-500 mt-3">
        {isPaymentFailed
          ? "Your demo order was created, but the simulated payment failed. This is useful for demonstrating failed payment handling."
          : "Your demo order has been created. Inventory and admin order data should update after checkout."}
      </p>

      {order && (
        <div className="mt-8 mx-auto max-w-md rounded-2xl bg-slate-50 border border-slate-200 p-6 text-left">
          <div className="flex justify-between py-2">
            <span className="text-slate-500">Order ID</span>
            <span className="font-semibold text-slate-900">#{order.id}</span>
          </div>

          <div className="flex justify-between py-2">
            <span className="text-slate-500">Status</span>
            <span
              className={`font-semibold ${
                isPaymentFailed ? "text-red-600" : "text-slate-900"
              }`}
            >
              {order.status}
            </span>
          </div>

          <div className="flex justify-between py-2">
            <span className="text-slate-500">Customer</span>
            <span className="font-semibold text-slate-900">
              {order.customerEmail}
            </span>
          </div>

          <div className="flex justify-between py-2 border-t border-slate-200 mt-2 pt-4">
            <span className="text-slate-500">Total</span>
            <span className="font-bold text-blue-600">
              R{order.totalAmount.toFixed(2)}
            </span>
          </div>
        </div>
      )}

      {!order && (
        <div className="mt-8 mx-auto max-w-md rounded-2xl bg-yellow-50 border border-yellow-200 p-4 text-yellow-700">
          Order details are unavailable because this page was opened directly.
        </div>
      )}

      <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
        <Link
          to="/customer/products"
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-3 rounded-xl font-semibold transition"
        >
          <ShoppingBag size={18} />
          Continue Shopping
        </Link>

        <Link
          to="/customer/orders"
          className="inline-flex items-center justify-center border border-slate-300 hover:bg-slate-50 text-slate-700 px-5 py-3 rounded-xl font-semibold transition"
        >
          View Order History
        </Link>
      </div>
    </div>
  );
}