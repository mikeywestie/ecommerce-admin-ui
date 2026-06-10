import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import {
  BadgePercent,
  CreditCard,
  Package,
  ShoppingBag,
  Tag,
  X,
} from "lucide-react";
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
  subtotal?: number;
  discount?: number;
  total: number;
  couponCode?: string | null;
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
  const [couponCode, setCouponCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [removingCoupon, setRemovingCoupon] = useState(false);
  const [error, setError] = useState("");
  const [couponMessage, setCouponMessage] = useState("");

  useEffect(() => {
    loadCart();
  }, []);

  async function loadCart() {
    try {
      setLoading(true);
      setError("");
      setCouponMessage("");

      const response = await api.get<CartResponse>("/api/cart");
      setCart(response.data);
      setCouponCode(response.data.couponCode ?? "");
    } catch {
      setError("Unable to load checkout summary.");
    } finally {
      setLoading(false);
    }
  }

  async function applyCoupon(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const code = couponCode.trim();

    if (!code) {
      setCouponMessage("");
      setError("Please enter a coupon code.");
      return;
    }

    try {
      setApplyingCoupon(true);
      setError("");
      setCouponMessage("");

      const response = await api.post<CartResponse>(
        `/api/cart/apply-coupon/${encodeURIComponent(code)}`
      );

      setCart(response.data);
      setCouponCode(response.data.couponCode ?? code.toUpperCase());
      setCouponMessage(`Coupon ${response.data.couponCode ?? code} applied.`);
    } catch {
      setError("Coupon could not be applied. Please check the code.");
    } finally {
      setApplyingCoupon(false);
    }
  }

  async function removeCoupon() {
    try {
      setRemovingCoupon(true);
      setError("");
      setCouponMessage("");

      const response = await api.delete<CartResponse>("/api/cart/coupon");

      setCart(response.data);
      setCouponCode("");
      setCouponMessage("Coupon removed.");
    } catch {
      setError("Unable to remove coupon.");
    } finally {
      setRemovingCoupon(false);
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
  const subtotal = cart?.subtotal ?? cart?.total ?? 0;
  const discount = cart?.discount ?? 0;
  const total = cart?.total ?? 0;
  const hasDiscount = discount > 0;
  const hasCoupon = Boolean(cart?.couponCode);

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
        <Package className="mx-auto h-12 w-12 text-slate-400 mb-4" />
        <h1 className="text-2xl font-bold text-slate-900">
          Nothing to checkout
        </h1>
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
          Apply a coupon, review your total, and place a simulated portfolio
          demo order.
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-xl">
          {error}
        </div>
      )}

      {couponMessage && (
        <div className="bg-emerald-500/10 border border-emerald-500 text-emerald-600 p-4 rounded-xl">
          {couponMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
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

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <BadgePercent className="h-6 w-6 text-blue-600" />
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Coupon Code
                </h2>
                <p className="text-sm text-slate-500">
                  Try a seeded demo coupon such as SAVE10 if available.
                </p>
              </div>
            </div>

            {hasCoupon ? (
              <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3 text-emerald-700">
                  <Tag className="h-5 w-5" />
                  <div>
                    <p className="font-bold">{cart?.couponCode}</p>
                    <p className="text-sm">
                      Coupon discount applied to this order.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={removeCoupon}
                  disabled={removingCoupon}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-300 bg-white px-4 py-2 font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-60"
                >
                  <X size={16} />
                  {removingCoupon ? "Removing..." : "Remove"}
                </button>
              </div>
            ) : (
              <form
                onSubmit={applyCoupon}
                className="mt-6 flex flex-col gap-3 sm:flex-row"
              >
                <input
                  type="text"
                  value={couponCode}
                  onChange={(event) => setCouponCode(event.target.value)}
                  placeholder="Enter coupon code"
                  className="flex-1 rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500"
                />

                <button
                  type="submit"
                  disabled={applyingCoupon}
                  className="rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
                >
                  {applyingCoupon ? "Applying..." : "Apply Coupon"}
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm h-fit">
          <h2 className="text-xl font-bold text-slate-900">Payment</h2>

          <div className="mt-6 rounded-2xl bg-slate-50 border border-slate-200 p-4 flex items-center gap-3 text-slate-600">
            <CreditCard className="h-5 w-5 text-slate-400" />
            <span>No real payment is taken. This creates a demo order.</span>
          </div>

          <div className="mt-6 space-y-3 border-t border-slate-200 pt-5">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span>R{subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-slate-600">
              <span>Discount</span>
              <span className={hasDiscount ? "text-emerald-600" : ""}>
                {hasDiscount ? "-" : ""}R{discount.toFixed(2)}
              </span>
            </div>

            {hasCoupon && (
              <div className="flex justify-between text-sm text-emerald-600">
                <span>Coupon</span>
                <span>{cart?.couponCode}</span>
              </div>
            )}

            <div className="border-t border-slate-200 pt-4 flex justify-between text-xl font-bold text-slate-900">
              <span>Total</span>
              <span>R{total.toFixed(2)}</span>
            </div>
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