import { useEffect, useState } from "react";
import { ShoppingCart, Package } from "lucide-react";

import api from "../../services/api";

type Product = {
  id: number;
  name: string;
  description: string;
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

      await api.post("/api/cart/items", {
        productId,
        quantity: 1,
      });

      alert("Product added to cart.");
    } catch (err) {
      console.error(err);
      alert("Failed to add product to cart.");
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

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-xl">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Browse Products
        </h1>
        <p className="text-slate-500 mt-2">
          Discover our latest products and add them to your cart.
        </p>
      </div>

      {/* Empty State */}
      {products.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Package className="mx-auto h-12 w-12 text-slate-400 mb-4" />
          <h2 className="text-xl font-semibold text-slate-900">
            No Products Available
          </h2>
          <p className="text-slate-500 mt-2">
            Please check back later.
          </p>
        </div>
      )}

      {/* Product Grid */}
      {products.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition p-6 flex flex-col"
            >
              <div className="flex-1">
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

              <button
                onClick={() => addToCart(product.id)}
                disabled={addingProductId === product.id}
                className="mt-6 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white px-4 py-3 rounded-xl font-semibold transition"
              >
                <ShoppingCart size={18} />
                {addingProductId === product.id
                  ? "Adding..."
                  : "Add to Cart"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}