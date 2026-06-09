import { useEffect, useState } from "react";
import { ArrowLeft, Package, ShoppingCart } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import api from "../../services/api";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30";

type Product = {
  id: number;
  name: string;
  description?: string;
  category?: string;
  imageUrl?: string;
  active?: boolean;
  price: number;
  createdAt?: string;
};

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProduct();
  }, [id]);

  async function loadProduct() {
    try {
      setLoading(true);
      setError("");

      const response = await api.get<Product>(`/api/products/${id}`);
      setProduct(response.data);
    } catch (err) {
      console.error(err);
      setError("Unable to load product details.");
    } finally {
      setLoading(false);
    }
  }

  async function addToCart() {
    if (!product) return;

    try {
      setAdding(true);

      await api.post("/api/cart/items", {
        productId: product.id,
        quantity: 1,
      });

      alert("Product added to cart.");
    } catch (err) {
      console.error(err);
      alert("Failed to add product to cart.");
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

  if (error || !product) {
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
          {error || "Product not found."}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        to="/customer/products"
        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-500 font-semibold"
      >
        <ArrowLeft size={18} />
        Back to products
      </Link>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="bg-slate-100 min-h-[360px]">
            <img
              src={product.imageUrl || FALLBACK_IMAGE}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="p-8 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex rounded-full bg-blue-50 text-blue-700 px-3 py-1 text-sm font-semibold">
                {product.category || "General"}
              </span>

              <span
                className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                  product.active === false
                    ? "bg-red-50 text-red-700"
                    : "bg-emerald-50 text-emerald-700"
                }`}
              >
                {product.active === false ? "Inactive" : "Available"}
              </span>
            </div>

            <h1 className="text-3xl font-bold text-slate-900">
              {product.name}
            </h1>

            <p className="text-slate-500 mt-4 leading-7">
              {product.description || "No description available."}
            </p>

            <div className="mt-8 text-4xl font-bold text-blue-600">
              R{product.price.toFixed(2)}
            </div>

            <div className="mt-8 rounded-2xl bg-slate-50 border border-slate-200 p-4 flex items-center gap-3 text-slate-600">
              <Package className="h-5 w-5 text-slate-400" />
              <span>This is a demo product for the customer storefront.</span>
            </div>

            <button
              onClick={addToCart}
              disabled={adding || product.active === false}
              className="mt-8 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white px-4 py-4 rounded-xl font-semibold transition"
            >
              <ShoppingCart size={20} />
              {adding ? "Adding..." : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}