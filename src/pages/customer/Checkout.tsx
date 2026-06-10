import { useEffect, useState } from "react";
import { CreditCard, Package, ShoppingBag } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import api from "../../services/api";

type CartItem = {
  itemId: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

type CartResponse = {
  cartId: number;
  items: CartItem[];
  total: number;
};

type OrderResponse = {
  id: number;
  customerName: string;
  customerEmail: string;
  status: string;
  totalAmount: number;
  createdAt: string;
};

export default function Checkout() {
  const navigate = useNavigate();

  const [cart, setCart] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCart();
  }, []);

  async function loadCart() {
    try {
      setLoading(true);
      setError("");

      const response = await api.get<CartResponse>("/api/cart");
      setCart(response.data);
    } catch {
      setError("Unable to load checkout summary.");
    } finally {
      setLoading(false);
    }
  }

  async function placeOrder() {
    try {
      setPlacingOrder(true);
      setError("");

      const response = await api.post<OrderResponse>("/api/cart/checkout");

      navigate("/customer/order-success", {
        replace: true,
        state: {
          order: response.data,
        },
      });
    } catch {
      setError("Unable to place order. Please check stock availability.");
    } finally {
      setPlacingOrder(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-500">
        Loading checkout...
      </div>
    );
  }

  const items = cart?.items ?? [];

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
        <Package className="mx-auto h-12 w-12 text-slate-400 mb-4" />
        <h1 className="text-2xl font-bold text-slate-900">Nothing to checkout</h1>
        <p className="text-slate-500 mt-2">
          Your cart is empty. Add products before placing an order.
        </p>

        <Link
          to="/customer/products"
          className="mt-6 inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-3 rounded-xl font-semibold transition"
        >
          <ShoppingBag size={18} />
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Checkout</h1>
        <p className="text-slate-500 mt-2">
          This is a simulated checkout for the portfolio demo.
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-xl">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">Order Items</h2>

          <div className="mt-6 divide-y divide-slate-200">
            {items.map((item) => (
              <div
                key={item.itemId}
                className="py-4 flex items-center justify-between gap-4"
              >
                <div>
                  <p className="font-semibold text-slate-900">
                    {item.productName}
                  </p>
                  <p className="text-sm text-slate-500">
                    Qty {item.quantity} × R{item.unitPrice.toFixed(2)}
                  </p>
                </div>

                <p className="font-bold text-blue-600">
                  R{item.lineTotal.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm h-fit">
          <h2 className="text-xl font-bold text-slate-900">Payment</h2>

          <div className="mt-6 rounded-2xl bg-slate-50 border border-slate-200 p-4 flex items-center gap-3 text-slate-600">
            <CreditCard className="h-5 w-5 text-slate-400" />
            <span>No real payment is taken. This creates a demo order.</span>
          </div>

          <div className="mt-6 border-t border-slate-200 pt-4 flex justify-between text-xl font-bold text-slate-900">
            <span>Total</span>
            <span>R{(cart?.total ?? 0).toFixed(2)}</span>
          </div>

          <button
            onClick={placeOrder}
            disabled={placingOrder}
            className="mt-6 w-full flex items-center justify-center bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white px-4 py-3 rounded-xl font-semibold transition"
          >
            {placingOrder ? "Placing Order..." : "Place Demo Order"}
          </button>

          <Link
            to="/customer/cart"
            className="mt-3 w-full flex items-center justify-center border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-3 rounded-xl font-semibold transition"
          >
            Back to Cart
          </Link>
        </div>
      </div>
    </div>
  );
}