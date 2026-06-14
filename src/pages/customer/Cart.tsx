import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Minus,
  Package,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";

import api from "../../services/api";

type StockStatus =
  | "IN_STOCK"
  | "ALMOST_SOLD_OUT"
  | "LOW_STOCK"
  | "OUT_OF_STOCK"
  | "INSUFFICIENT_STOCK"
  | "INACTIVE";

type CartItem = {
  itemId: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  availableQuantity?: number;
  stockStatus?: StockStatus;
  stockMessage?: string;
};

type CartResponse = {
  cartId: number;
  items: CartItem[];
  total: number;
};

export default function Cart() {
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingItemId, setUpdatingItemId] = useState<number | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCart();
  }, []);

  const items = useMemo(() => cart?.items ?? [], [cart]);

  const hasInvalidStock = useMemo(
    () =>
      items.some((item) =>
        ["OUT_OF_STOCK", "INSUFFICIENT_STOCK", "INACTIVE"].includes(item.stockStatus ?? "IN_STOCK")
      ),
    [items]
  );

  async function loadCart() {
    try {
      setLoading(true);
      setError("");

      const response = await api.get<CartResponse>("/api/cart");
      setCart(response.data);
    } catch {
      setError("Unable to load cart.");
    } finally {
      setLoading(false);
    }
  }

  async function updateQuantity(item: CartItem, quantity: number) {
    if (quantity < 1) return;

    const isIncreasing = quantity > item.quantity;

    if (isIncreasing && item.availableQuantity !== undefined && quantity > item.availableQuantity) {
      setError(`Only ${item.availableQuantity} left for ${item.productName}.`);
      return;
    }

    try {
      setUpdatingItemId(item.itemId);
      setError("");

      const response = await api.put<CartResponse>(`/api/cart/items/${item.itemId}`, { quantity });

      setCart(response.data);
    } catch {
      setError("Unable to update cart item.");
    } finally {
      setUpdatingItemId(null);
    }
  }

  async function removeItem(item: CartItem) {
    try {
      setUpdatingItemId(item.itemId);
      setError("");

      const response = await api.delete<CartResponse>(`/api/cart/items/${item.itemId}`);

      setCart(response.data);
    } catch {
      setError("Unable to remove cart item.");
    } finally {
      setUpdatingItemId(null);
    }
  }

  function getStockBadgeStyle(status?: StockStatus) {
    if (status === "IN_STOCK") {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }

    if (status === "ALMOST_SOLD_OUT" || status === "LOW_STOCK") {
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    }

    return "bg-red-50 text-red-700 border-red-200";
  }

  function getStockIcon(status?: StockStatus) {
    if (status === "IN_STOCK") {
      return <CheckCircle2 size={15} />;
    }

    return <AlertTriangle size={15} />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-500">Loading cart...</div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Your Cart</h1>
          <p className="text-slate-500 mt-2">Review your selected products before checkout.</p>
        </div>

        <Link
          to="/customer/products"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          <ShoppingBag size={18} />
          Continue Shopping
        </Link>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-xl">
          {error}
        </div>
      )}

      {hasInvalidStock && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-xl">
          Some items in your cart are no longer available in the requested quantity. Please update
          your cart before checkout.
        </div>
      )}

      {items.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Package className="mx-auto h-12 w-12 text-slate-400 mb-4" />
          <h2 className="text-xl font-semibold text-slate-900">Your cart is empty</h2>
          <p className="text-slate-500 mt-2">
            Add products from the storefront to start a demo order.
          </p>

          <Link
            to="/customer/products"
            className="mt-6 inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-3 rounded-xl font-semibold transition"
          >
            <ShoppingBag size={18} />
            Browse Products
          </Link>
        </div>
      )}

      {items.length > 0 && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-4">
            {items.map((item) => {
              const isUpdating = updatingItemId === item.itemId;
              const maxReached =
                item.availableQuantity !== undefined && item.quantity >= item.availableQuantity;

              return (
                <div
                  key={item.itemId}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0">
                      <h2 className="text-lg font-semibold text-slate-900">{item.productName}</h2>

                      <p className="text-slate-500 mt-1">R{item.unitPrice.toFixed(2)} each</p>

                      <div
                        className={`mt-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-semibold ${getStockBadgeStyle(
                          item.stockStatus
                        )}`}
                      >
                        {getStockIcon(item.stockStatus)}
                        {item.stockMessage ?? "In stock."}
                      </div>

                      <p className="text-blue-600 font-bold mt-3">R{item.lineTotal.toFixed(2)}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center rounded-xl border border-slate-300 bg-slate-50 p-1">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item, item.quantity - 1)}
                          disabled={item.quantity <= 1 || isUpdating}
                          className="h-10 w-10 rounded-lg bg-white text-slate-900 shadow-sm flex items-center justify-center hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={17} strokeWidth={2.5} />
                        </button>

                        <div className="h-10 min-w-14 px-4 flex items-center justify-center text-slate-900 font-bold">
                          {isUpdating ? "..." : item.quantity}
                        </div>

                        <button
                          type="button"
                          onClick={() => updateQuantity(item, item.quantity + 1)}
                          disabled={isUpdating || maxReached}
                          className="h-10 w-10 rounded-lg bg-white text-slate-900 shadow-sm flex items-center justify-center hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                          aria-label="Increase quantity"
                        >
                          <Plus size={17} strokeWidth={2.5} />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item)}
                        disabled={isUpdating}
                        className="h-12 w-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 disabled:opacity-50"
                        aria-label="Remove item"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm h-fit">
            <h2 className="text-xl font-bold text-slate-900">Order Summary</h2>

            <div className="mt-6 space-y-3">
              <div className="flex justify-between text-slate-600">
                <span>Items</span>
                <span>{items.length}</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Total quantity</span>
                <span>{items.reduce((sum, item) => sum + item.quantity, 0)}</span>
              </div>

              <div className="border-t border-slate-200 pt-4 flex justify-between text-xl font-bold text-slate-900">
                <span>Total</span>
                <span>R{(cart?.total ?? 0).toFixed(2)}</span>
              </div>
            </div>

            {hasInvalidStock ? (
              <button
                type="button"
                disabled
                className="mt-6 w-full flex items-center justify-center bg-slate-300 text-slate-500 px-4 py-3 rounded-xl font-semibold cursor-not-allowed"
              >
                Resolve Stock Issues
              </button>
            ) : (
              <Link
                to="/customer/checkout"
                className="mt-6 w-full flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white px-4 py-3 rounded-xl font-semibold transition"
              >
                Continue to Checkout
              </Link>
            )}

            <button
              type="button"
              onClick={loadCart}
              className="mt-3 w-full flex items-center justify-center border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-3 rounded-xl font-semibold transition"
            >
              Refresh Stock
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
