import { useEffect, useMemo, useState } from "react";
import { Eye, Package, Search, ShoppingCart, X } from "lucide-react";
import { Link } from "react-router-dom";

import Button from "@/components/ui/Button";
import PaginationControls from "@/components/ui/PaginationControls";
import api from "../../services/api";

type Product = {
  id: number;
  name: string;
  description?: string | null;
  category?: string | null;
  imageUrl?: string | null;
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

function getProductDescription(product: Product) {
  const description = product.description?.trim();

  if (description) {
    return description;
  }

  return "A demo store product ready to add to cart and use in the checkout flow.";
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [addingProductId, setAddingProductId] = useState<number | null>(null);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      setLoading(true);
      setError("");

      const response = await api.get<PageResponse<Product>>(
        "/api/products?page=0&size=100&sortBy=name&sortDir=asc"
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

  const categories = useMemo(() => {
    return Array.from(
      new Set(
        products
          .filter((product) => product.active !== false)
          .map((product) => product.category || "General")
      )
    ).sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products
      .filter((product) => product.active !== false)
      .filter((product) => {
        const matchesCategory =
          categoryFilter === "ALL" ||
          (product.category || "General") === categoryFilter;

        const matchesSearch =
          !query ||
          `${product.name} ${product.category ?? ""} ${
            product.description ?? ""
          }`
            .toLowerCase()
            .includes(query);

        return matchesCategory && matchesSearch;
      });
  }, [products, search, categoryFilter]);

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-500">
        Loading products...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">Browse Products</h1>
        <p className="mt-2 text-slate-500">
          Discover demo products, filter the full catalog, add items to your
          cart, and simulate paid or failed checkout scenarios.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-3 lg:grid-cols-[1fr_260px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search full catalog, e.g. mouse, keyboard, router..."
              className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-slate-900 outline-none transition focus:border-blue-500"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(event) => {
              setCategoryFilter(event.target.value);
              setCurrentPage(1);
            }}
            className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500"
          >
            <option value="ALL">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {(search.trim() || categoryFilter !== "ALL") && (
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-500">
            <span>
              Showing{" "}
              <span className="font-semibold text-slate-900">
                {filteredProducts.length}
              </span>{" "}
              matching product{filteredProducts.length === 1 ? "" : "s"}.
            </span>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCategoryFilter("ALL");
                setCurrentPage(1);
              }}
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {success && (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-green-500 bg-green-500/10 p-4 text-green-600">
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
        <div className="flex items-center justify-between gap-4 rounded-xl border border-red-500 bg-red-500/10 p-4 text-red-500">
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

      {filteredProducts.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
          <Package className="mx-auto mb-4 h-12 w-12 text-slate-400" />
          <h2 className="text-xl font-semibold text-slate-900">
            No Products Found
          </h2>
          <p className="mt-2 text-slate-500">
            Try a different keyword or category.
          </p>
        </div>
      )}

      {filteredProducts.length > 0 && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {paginatedProducts.map((product) => (
            <article
              key={product.id}
              className="flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="h-48 overflow-hidden bg-slate-100">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-300 hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-slate-100 text-sm font-medium text-slate-400">
                    No image available yet
                  </div>
                )}
              </div>

              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-start justify-between gap-3">
                  <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    {product.category || "General"}
                  </span>

                  <span className="text-xs font-semibold text-emerald-600">
                    Active
                  </span>
                </div>

                <div className="mt-4 flex-1">
                  <h2 className="text-xl font-semibold text-slate-900">
                    {product.name}
                  </h2>

                  <p className="mt-3 line-clamp-3 min-h-[4.5rem] text-slate-500">
                    {getProductDescription(product)}
                  </p>

                  <div className="mt-4 text-2xl font-bold text-blue-600">
                    R{product.price.toFixed(2)}
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Link
                    to={`/customer/products/${product.id}`}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    <Eye size={18} />
                    Details
                  </Link>

                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => addToCart(product.id)}
                    disabled={addingProductId === product.id}
                    icon={<ShoppingCart size={18} />}
                    className="w-full"
                  >
                    {addingProductId === product.id ? "Adding..." : "Add"}
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <PaginationControls
        page={currentPage}
        pageSize={pageSize}
        totalItems={filteredProducts.length}
        itemLabel="products"
        onPageChange={setCurrentPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setCurrentPage(1);
        }}
      />
    </div>
  );
}
