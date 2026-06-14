import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Minus,
  Package,
  Plus,
  ShoppingCart,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";

import api from "../../services/api";

type StockStatus = "IN_STOCK" | "ALMOST_SOLD_OUT" | "LOW_STOCK" | "OUT_OF_STOCK" | "INACTIVE";

type Product = {
  id: number;
  name: string;
  description?: string | null;
  category?: string | null;
  imageUrl?: string | null;
  active?: boolean;
  price: number;
  availableQuantity?: number;
  stockStatus?: StockStatus;
  stockMessage?: string;
  createdAt?: string;
};

function getProductDescription(product: Product) {
  const description = product.description?.trim();

  if (description) {
    return description;
  }

  return "";
}

export default function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadProduct = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const response = await api.get<Product>(`/api/products/${id}`);
      setProduct(response.data);

      const stock = response.data.availableQuantity ?? 0;

      if (stock <= 0) {
        setQuantity(1);
      } else {
        setQuantity((current) => Math.min(Math.max(current, 1), stock));
      }
    } catch {
      setError("Unable to load product details.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadProduct();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadProduct]);

  const availableQuantity = product?.availableQuantity ?? 0;
  const stockStatus = product?.stockStatus ?? "OUT_OF_STOCK";
  const isInactive = product?.active === false || stockStatus === "INACTIVE";
  const isOutOfStock = stockStatus === "OUT_OF_STOCK" || availableQuantity <= 0;

  const canAddToCart = !!product && !isInactive && !isOutOfStock && quantity <= availableQuantity;

  const stockDisplay = useMemo(() => {
    if (isInactive) {
      return {
        label: "Unavailable",
        message: product?.stockMessage ?? "This product is no longer available.",
        className: "bg-red-50 text-red-700 border-red-200",
        icon: <AlertTriangle size={16} />,
      };
    }

    if (isOutOfStock) {
      return {
        label: "Out of stock",
        message: product?.stockMessage ?? "This product is currently out of stock.",
        className: "bg-red-50 text-red-700 border-red-200",
        icon: <AlertTriangle size={16} />,
      };
    }

    if (stockStatus === "LOW_STOCK" || stockStatus === "ALMOST_SOLD_OUT") {
      return {
        label: stockStatus === "LOW_STOCK" ? "Low stock" : "Almost sold out",
        message: product?.stockMessage ?? `Only ${availableQuantity} left.`,
        className: "bg-yellow-50 text-yellow-700 border-yellow-200",
        icon: <AlertTriangle size={16} />,
      };
    }

    return {
      label: "In stock",
      message: product?.stockMessage ?? `${availableQuantity} available.`,
      className: "bg-emerald-50 text-emerald-700 border-emerald-200",
      icon: <CheckCircle2 size={16} />,
    };
  }, [availableQuantity, isInactive, isOutOfStock, product, stockStatus]);

  function decreaseQuantity() {
    setSuccess("");
    setError("");
    setQuantity((value) => Math.max(1, value - 1));
  }

  function increaseQuantity() {
    setSuccess("");
    setError("");

    if (availableQuantity > 0 && quantity >= availableQuantity) {
      setError(`Only ${availableQuantity} left in stock.`);
      return;
    }

    setQuantity((value) => value + 1);
  }

  async function addToCart() {
    if (!product) return;

    if (isInactive) {
      setError("This product is no longer available.");
      return;
    }

    if (isOutOfStock) {
      setError("This product is currently out of stock.");
      return;
    }

    if (quantity > availableQuantity) {
      setError(`Only ${availableQuantity} left in stock.`);
      return;
    }

    try {
      setAdding(true);
      setError("");
      setSuccess("");

      await api.post("/api/cart/items", {
        productId: product.id,
        quantity,
      });

      setSuccess(`${quantity} item${quantity === 1 ? "" : "s"} added to cart.`);
      await loadProduct();
    } catch {
      setError("Failed to add product to cart.");
    } finally {
      setAdding(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-500">
        Loading product details...
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="space-y-6">
        <Link
          to="/customer/products"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-500 font-semibold"
        >
          <ArrowLeft size={18} />
          Back to products
        </Link>

        <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-xl">
          {error}
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="space-y-6">
      <Link
        to="/customer/products"
        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-500 font-semibold"
      >
        <ArrowLeft size={18} />
        Back to products
      </Link>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-xl">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500 text-emerald-600 p-4 rounded-xl">
          {success}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="bg-slate-100 min-h-[360px]">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-slate-100 text-slate-400 text-lg font-medium">
                No image available yet
              </div>
            )}
          </div>

          <div className="p-8 flex flex-col">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="inline-flex rounded-full bg-blue-50 text-blue-700 px-3 py-1 text-sm font-semibold">
                {product.category || "General"}
              </span>

              <span
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-semibold ${stockDisplay.className}`}
              >
                {stockDisplay.icon}
                {stockDisplay.label}
              </span>
            </div>

            <h1 className="text-3xl font-bold text-slate-900">{product.name}</h1>

            <p className="text-slate-500 mt-4 leading-7">{getProductDescription(product)}</p>

            <div className="mt-8 text-4xl font-bold text-blue-600">R{product.price.toFixed(2)}</div>

            <div className="mt-8 rounded-2xl bg-slate-50 border border-slate-200 p-4 flex items-start gap-3 text-slate-600">
              <Package className="h-5 w-5 text-slate-400 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-700">Live stock check</p>
                <p className="text-sm mt-1">{stockDisplay.message}</p>
              </div>
            </div>

            <div className="mt-8">
              <p className="text-sm font-semibold text-slate-700 mb-3">Quantity</p>

              <div className="flex items-center rounded-xl border border-slate-300 bg-slate-50 p-1 w-fit">
                <button
                  type="button"
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1 || adding || isOutOfStock || isInactive}
                  className="h-12 w-12 rounded-lg bg-white text-slate-900 shadow-sm flex items-center justify-center hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Decrease quantity"
                >
                  <Minus size={18} strokeWidth={2.5} />
                </button>

                <div className="h-12 min-w-16 px-5 flex items-center justify-center text-xl font-bold text-slate-900">
                  {quantity}
                </div>

                <button
                  type="button"
                  onClick={increaseQuantity}
                  disabled={adding || isOutOfStock || isInactive || quantity >= availableQuantity}
                  className="h-12 w-12 rounded-lg bg-white text-slate-900 shadow-sm flex items-center justify-center hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Increase quantity"
                >
                  <Plus size={18} strokeWidth={2.5} />
                </button>
              </div>

              {availableQuantity > 0 && (
                <p className="text-sm text-slate-500 mt-2">
                  Maximum available: {availableQuantity}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={addToCart}
              disabled={adding || !canAddToCart}
              className="mt-8 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white px-4 py-4 rounded-xl font-semibold transition"
            >
              <ShoppingCart size={20} />
              {adding
                ? "Adding..."
                : isOutOfStock
                  ? "Out of Stock"
                  : isInactive
                    ? "Unavailable"
                    : "Add to Cart"}
            </button>

            <Link
              to="/customer/cart"
              className="mt-3 w-full flex items-center justify-center border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-4 rounded-xl font-semibold transition"
            >
              View Cart
            </Link>

            <button
              type="button"
              onClick={loadProduct}
              className="mt-3 w-full flex items-center justify-center border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-4 rounded-xl font-semibold transition"
            >
              Refresh Stock
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
