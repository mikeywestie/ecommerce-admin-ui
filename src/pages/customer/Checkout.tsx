import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import {
  BadgePercent,
  CheckCircle2,
  CreditCard,
  Package,
  ShoppingBag,
  Tag,
  X,
  XCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import Button from "@/components/ui/Button";
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

type PaymentSimulation = "SUCCESS" | "FAILED";

export default function Checkout() {
  const navigate = useNavigate();

  const [cart, setCart] = useState<CartResponse | null>(null);
  const [couponCode, setCouponCode] = useState("");
  const [paymentSimulation, setPaymentSimulation] = useState<PaymentSimulation>("SUCCESS");
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [removingCoupon, setRemovingCoupon] = useState(false);
  const [error, setError] = useState("");
  const [couponMessage, setCouponMessage] = useState("");

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

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadCart();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

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

      const response = await api.post<OrderResponse>(
        `/api/cart/checkout?paymentOutcome=${paymentSimulation}`
      );

      const order =
        paymentSimulation === "FAILED"
          ? { ...response.data, status: "PAYMENT_FAILED" }
          : response.data;

      navigate("/customer/order-success", {
        replace: true,
        state: {
          order,
          simulation: paymentSimulation,
        },
      });
    } catch {
      setError(
        "Unable to place order. Please check stock availability or backend payment simulation support."
      );
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
      <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
        <Package className="mx-auto mb-4 h-12 w-12 text-slate-400" />
        <h1 className="text-2xl font-bold text-slate-900">Nothing to checkout</h1>
        <p className="mt-2 text-slate-500">
          Your cart is empty. Add products before placing an order.
        </p>

        <Link
          to="/customer/products"
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-500"
        >
          <ShoppingBag size={18} />
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">Checkout</h1>
        <p className="mt-2 text-slate-500">
          Apply a coupon, review your total, and choose a demo payment outcome for the pilot
          walkthrough.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500 bg-red-500/10 p-4 text-red-500">
          {error}
        </div>
      )}

      {couponMessage && (
        <div className="rounded-xl border border-emerald-500 bg-emerald-500/10 p-4 text-emerald-600">
          {couponMessage}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Order Items</h2>

            <div className="mt-6 divide-y divide-slate-200">
              {items.map((item) => (
                <div
                  key={item.itemId}
                  className="grid gap-2 py-4 sm:grid-cols-[1fr_auto] sm:items-center"
                >
                  <div>
                    <p className="font-semibold text-slate-900">{item.productName}</p>
                    <p className="text-sm text-slate-500">
                      Qty {item.quantity} × R{item.unitPrice.toFixed(2)}
                    </p>
                  </div>

                  <p className="font-bold text-blue-600">R{item.lineTotal.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <BadgePercent className="h-6 w-6 text-blue-600" />
              <div>
                <h2 className="text-xl font-bold text-slate-900">Coupon Code</h2>
                <p className="text-sm text-slate-500">Try SAVE10, WELCOME250, FIRSTBUY, or VIP5.</p>
              </div>
            </div>

            {hasCoupon ? (
              <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3 text-emerald-700">
                  <Tag className="h-5 w-5" />
                  <div>
                    <p className="font-bold">{cart?.couponCode}</p>
                    <p className="text-sm">Coupon discount applied to this order.</p>
                  </div>
                </div>

                <Button
                  onClick={removeCoupon}
                  disabled={removingCoupon}
                  variant="secondary"
                  icon={<X size={16} />}
                >
                  {removingCoupon ? "Removing..." : "Remove"}
                </Button>
              </div>
            ) : (
              <form onSubmit={applyCoupon} className="mt-6 flex flex-col gap-3 sm:flex-row">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(event) => setCouponCode(event.target.value)}
                  placeholder="Enter coupon code"
                  className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500"
                />

                <Button type="submit" disabled={applyingCoupon}>
                  {applyingCoupon ? "Applying..." : "Apply Coupon"}
                </Button>
              </form>
            )}
          </div>
        </div>

        <div className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">Payment</h2>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-600">
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-slate-400" />
              <span>No real payment is taken. This creates a demo order.</span>
            </div>
          </div>

          <div className="mt-5 grid gap-3">
            <button
              type="button"
              onClick={() => setPaymentSimulation("SUCCESS")}
              className={`rounded-2xl border p-4 text-left transition ${
                paymentSimulation === "SUCCESS"
                  ? "border-emerald-400 bg-emerald-50 text-emerald-800"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5" />
                <div>
                  <p className="font-bold">Simulate paid order</p>
                  <p className="text-sm">Demonstrates PAID / SUCCESS.</p>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setPaymentSimulation("FAILED")}
              className={`rounded-2xl border p-4 text-left transition ${
                paymentSimulation === "FAILED"
                  ? "border-red-400 bg-red-50 text-red-700"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <XCircle className="h-5 w-5" />
                <div>
                  <p className="font-bold">Simulate payment failed</p>
                  <p className="text-sm">
                    Frontend is ready; backend must honour paymentOutcome=FAILED.
                  </p>
                </div>
              </div>
            </button>
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

            <div className="flex justify-between border-t border-slate-200 pt-4 text-xl font-bold text-slate-900">
              <span>Total</span>
              <span>R{total.toFixed(2)}</span>
            </div>
          </div>

          <Button
            onClick={placeOrder}
            disabled={placingOrder}
            variant={paymentSimulation === "FAILED" ? "danger" : "primary"}
            size="lg"
            className="mt-6 w-full"
          >
            {placingOrder
              ? "Placing Order..."
              : paymentSimulation === "FAILED"
                ? "Place Failed Demo Order"
                : "Place Paid Demo Order"}
          </Button>

          <Link
            to="/customer/cart"
            className="mt-3 flex w-full items-center justify-center rounded-xl border border-slate-300 px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Back to Cart
          </Link>
        </div>
      </div>
    </div>
  );
}
