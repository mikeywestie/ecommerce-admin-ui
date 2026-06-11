import { useEffect, useState } from "react";
import { Eye, Package, ShoppingCart, X } from "lucide-react";
import { Link } from "react-router-dom";

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
};

type PageResponse<T> = {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
};

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [addingProductId, setAddingProductId] = useState<number | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      setLoading(true);
      setError("");

      const response = await api.get<PageResponse<Product>>(
        "/api/products?page=0&size=20&sortBy=name&sortDir=asc"
      );

      setProducts(response.data.content);
    } catch (err) {
      console.error(err);
      setError("Unable to load products.");
    } finally {
      setLoading(false);
    }
  }

  async function addToCart(productId: number) {
    try {
      setAddingProductId(productId);
      setError("");
      setSuccess("");

      await api.post("/api/cart/items", {
        productId,
        quantity: 1,
      });

      setSuccess("Product added to cart.");
    } catch (err) {
      console.error(err);
      setError("Failed to add product to cart.");
    } finally {
      setAddingProductId(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-500">
        Loading products...
      </div>
    );
  }

  const activeProducts = products.filter((product) => product.active !== false);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Browse Products</h1>
        <p className="text-slate-500 mt-2">
          Discover demo products, add them to your cart, and simulate a purchase.
        </p>
      </div>

      {success && (
        <div className="flex items-center justify-between gap-4 bg-green-500/10 border border-green-500 text-green-600 p-4 rounded-xl">
          <span>{success}</span>
          <button
            type="button"
            onClick={() => setSuccess("")}
            className="text-green-700 hover:text-green-900"
            aria-label="Dismiss success message"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {error && (
        <div className="flex items-center justify-between gap-4 bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-xl">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setError("")}
            className="text-red-500 hover:text-red-700"
            aria-label="Dismiss error message"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {activeProducts.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Package className="mx-auto h-12 w-12 text-slate-400 mb-4" />
          <h2 className="text-xl font-semibold text-slate-900">
            No Products Available
          </h2>
          <p className="text-slate-500 mt-2">Please check back later.</p>
        </div>
      )}

      {activeProducts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {activeProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col"
            >
              <div className="h-48 bg-slate-100 overflow-hidden">
                <img
                  src={product.imageUrl || FALLBACK_IMAGE}
                  alt={product.name}
                  className="h-full w-full object-cover hover:scale-105 transition duration-300"
                />
              </div>

              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-3">
                  <span className="inline-flex rounded-full bg-blue-50 text-blue-700 px-3 py-1 text-xs font-semibold">
                    {product.category || "General"}
                  </span>

                  <span className="text-xs text-emerald-600 font-semibold">
                    Active
                  </span>
                </div>

                <div className="flex-1 mt-4">
                  <h2 className="text-xl font-semibold text-slate-900">
                    {product.name}
                  </h2>

                  <p className="text-slate-500 mt-3 line-clamp-3">
                    {product.description || "No description available."}
                  </p>

                  <div className="mt-4 text-2xl font-bold text-blue-600">
                    R{product.price.toFixed(2)}
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Link
                    to={`/customer/products/${product.id}`}
                    className="w-full flex items-center justify-center gap-2 border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-3 rounded-xl font-semibold transition"
                  >
                    <Eye size={18} />
                    Details
                  </Link>

                  <button
                    onClick={() => addToCart(product.id)}
                    disabled={addingProductId === product.id}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white px-4 py-3 rounded-xl font-semibold transition"
                  >
                    <ShoppingCart size={18} />
                    {addingProductId === product.id ? "Adding..." : "Add"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}