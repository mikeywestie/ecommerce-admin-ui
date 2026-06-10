import { useEffect, useState } from "react";
import { Minus, Package, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

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

export default function Cart() {
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingItemId, setUpdatingItemId] = useState<number | null>(null);
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
      setError("Unable to load cart.");
    } finally {
      setLoading(false);
    }
  }

  async function updateQuantity(item: CartItem, quantity: number) {
    if (quantity < 1) return;

    try {
      setUpdatingItemId(item.itemId);

      const response = await api.put<CartResponse>(
        `/api/cart/items/${item.itemId}`,
        { quantity }
      );

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

      const response = await api.delete<CartResponse>(
        `/api/cart/items/${item.itemId}`
      );

      setCart(response.data);
    } catch {
      setError("Unable to remove cart item.");
    } finally {
      setUpdatingItemId(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-500">
        Loading cart...
      </div>
    );
  }

  const items = cart?.items ?? [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Your Cart</h1>
        <p className="text-slate-500 mt-2">
          Review your selected products before checkout.
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-xl">
          {error}
        </div>
      )}

      {items.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Package className="mx-auto h-12 w-12 text-slate-400 mb-4" />
          <h2 className="text-xl font-semibold text-slate-900">
            Your cart is empty
          </h2>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.itemId}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      {item.productName}
                    </h2>
                    <p className="text-slate-500 mt-1">
                      R{item.unitPrice.toFixed(2)} each
                    </p>
                    <p className="text-blue-600 font-bold mt-2">
                      R{item.lineTotal.toFixed(2)}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateQuantity(item, item.quantity - 1)}
                      disabled={item.quantity <= 1 || updatingItemId === item.itemId}
                      className="h-10 w-10 rounded-xl border border-slate-300 flex items-center justify-center hover:bg-slate-50 disabled:opacity-50"
                    >
                      <Minus size={16} />
                    </button>

                    <span className="w-10 text-center font-semibold">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => updateQuantity(item, item.quantity + 1)}
                      disabled={updatingItemId === item.itemId}
                      className="h-10 w-10 rounded-xl border border-slate-300 flex items-center justify-center hover:bg-slate-50 disabled:opacity-50"
                    >
                      <Plus size={16} />
                    </button>

                    <button
                      onClick={() => removeItem(item)}
                      disabled={updatingItemId === item.itemId}
                      className="h-10 w-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 disabled:opacity-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
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
                <span>
                  {items.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              </div>

              <div className="border-t border-slate-200 pt-4 flex justify-between text-xl font-bold text-slate-900">
                <span>Total</span>
                <span>R{(cart?.total ?? 0).toFixed(2)}</span>
              </div>
            </div>

            <Link
              to="/customer/checkout"
              className="mt-6 w-full flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white px-4 py-3 rounded-xl font-semibold transition"
            >
              Continue to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}