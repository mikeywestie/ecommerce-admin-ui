import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import {
  Archive,
  Edit,
  PackagePlus,
  Save,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

import type { InventoryItem, ProductFormPayload } from "@/types/Inventory";
import {
  createProduct,
  getInventory,
  obsoleteProduct,
  setStockQuantity,
  updateProduct,
} from "../../services/inventoryService";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30";

const emptyForm: ProductFormPayload = {
  name: "",
  description: "",
  category: "General",
  imageUrl: "",
  active: true,
  price: 0,
  initialStock: 0,
};

type ModalMode = "create" | "edit" | null;

export default function Inventory() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [stockFilter, setStockFilter] = useState("ALL");

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [form, setForm] = useState<ProductFormPayload>(emptyForm);

  useEffect(() => {
    loadInventory();
  }, []);

  async function loadInventory() {
    try {
      setLoading(true);
      setError("");

      const data = await getInventory();
      setInventory(data);
    } catch {
      setError("Failed to load inventory.");
    } finally {
      setLoading(false);
    }
  }

  const categories = useMemo(() => {
    return Array.from(
      new Set(
        inventory
          .map((item) => item.product.category || "General")
          .filter(Boolean)
      )
    ).sort();
  }, [inventory]);

  const filteredInventory = useMemo(() => {
    return inventory.filter((item) => {
      const product = item.product;
      const query = search.trim().toLowerCase();

      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        (product.category || "").toLowerCase().includes(query);

      const matchesCategory =
        categoryFilter === "ALL" ||
        (product.category || "General") === categoryFilter;

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" && product.active !== false) ||
        (statusFilter === "INACTIVE" && product.active === false);

      const matchesStock =
        stockFilter === "ALL" ||
        (stockFilter === "LOW" && item.quantityAvailable <= 10) ||
        (stockFilter === "WARNING" &&
          item.quantityAvailable > 10 &&
          item.quantityAvailable <= 20) ||
        (stockFilter === "IN_STOCK" && item.quantityAvailable > 20);

      return matchesSearch && matchesCategory && matchesStatus && matchesStock;
    });
  }, [inventory, search, categoryFilter, statusFilter, stockFilter]);

  function getStockStyle(quantity: number) {
    if (quantity <= 10) return "bg-red-500/20 text-red-400";
    if (quantity <= 20) return "bg-yellow-500/20 text-yellow-400";
    return "bg-green-500/20 text-green-400";
  }

  function getStockLabel(quantity: number) {
    if (quantity <= 10) return "Low Stock";
    if (quantity <= 20) return "Warning";
    return "In Stock";
  }

  function openCreateModal() {
    setSelectedItem(null);
    setForm(emptyForm);
    setModalMode("create");
    setError("");
    setSuccess("");
  }

  function openEditModal(item: InventoryItem) {
    setSelectedItem(item);
    setForm({
      name: item.product.name,
      description: item.product.description || "",
      category: item.product.category || "General",
      imageUrl: item.product.imageUrl || "",
      active: item.product.active !== false,
      price: item.product.price,
      initialStock: item.quantityAvailable,
    });
    setModalMode("edit");
    setError("");
    setSuccess("");
  }

  function closeModal() {
    setModalMode(null);
    setSelectedItem(null);
    setForm(emptyForm);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (modalMode === "create") {
        await createProduct({
          ...form,
          initialStock: form.initialStock ?? 0,
        });

        setSuccess("Product created successfully.");
      }

      if (modalMode === "edit" && selectedItem) {
        await updateProduct(selectedItem.product.id, {
          ...form,
          initialStock: null,
        });

        await setStockQuantity(
          selectedItem.product.id,
          Number(form.initialStock ?? 0)
        );

        setSuccess("Product updated successfully.");
      }

      closeModal();
      await loadInventory();
    } catch {
      setError("Failed to save product.");
    } finally {
      setSaving(false);
    }
  }

  async function handleObsolete(item: InventoryItem) {
    const confirmed = window.confirm(
      `Mark "${item.product.name}" as inactive/obsolete?`
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      await obsoleteProduct(item.product.id);
      setSuccess("Product marked as inactive.");
      await loadInventory();
    } catch {
      setError("Failed to obsolete product.");
    }
  }

  async function handleQuickStockUpdate(item: InventoryItem) {
    const value = window.prompt(
      `Set stock quantity for "${item.product.name}"`,
      String(item.quantityAvailable)
    );

    if (value === null) return;

    const quantity = Number(value);

    if (Number.isNaN(quantity) || quantity < 0) {
      setError("Stock quantity must be zero or greater.");
      return;
    }

    try {
      setError("");
      setSuccess("");

      await setStockQuantity(item.product.id, quantity);
      setSuccess("Stock quantity updated.");
      await loadInventory();
    } catch {
      setError("Failed to update stock quantity.");
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Inventory</h1>

        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-20 bg-slate-800 rounded-xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Inventory</h1>
          <p className="text-slate-400 mt-2">
            Manage products, stock levels, catalog visibility, and product
            status.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-500 transition"
        >
          <PackagePlus className="h-5 w-5" />
          Add Product
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-500 bg-red-500/20 p-4 text-red-300">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 rounded-xl border border-green-500 bg-green-500/20 p-4 text-green-300">
          {success}
        </div>
      )}

      <div className="mb-6 rounded-2xl border border-slate-700 bg-slate-800 p-4">
        <div className="mb-3 flex items-center gap-2 text-slate-300 font-semibold">
          <SlidersHorizontal className="h-5 w-5" />
          Filters
        </div>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search product or category..."
              className="w-full rounded-xl border border-slate-700 bg-slate-900 py-3 pl-10 pr-4 text-white outline-none focus:border-blue-500"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-500"
          >
            <option value="ALL">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>

          <select
            value={stockFilter}
            onChange={(event) => setStockFilter(event.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-500"
          >
            <option value="ALL">All Stock Levels</option>
            <option value="LOW">Low Stock</option>
            <option value="WARNING">Warning</option>
            <option value="IN_STOCK">In Stock</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl bg-slate-800">
        <table className="w-full">
          <thead className="bg-slate-900">
            <tr>
              <th className="text-left p-4">Product</th>
              <th className="text-left p-4">Category</th>
              <th className="text-left p-4">Price</th>
              <th className="text-left p-4">Product Status</th>
              <th className="text-left p-4">Quantity</th>
              <th className="text-left p-4">Stock Status</th>
              <th className="text-right p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredInventory.map((item) => (
              <tr
                key={item.inventoryId}
                className="border-t border-slate-700 hover:bg-slate-700 transition"
              >
                <td className="p-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={item.product.imageUrl || FALLBACK_IMAGE}
                      alt={item.product.name}
                      className="h-14 w-14 rounded-xl object-cover bg-slate-700"
                    />

                    <div>
                      <p className="font-semibold text-white">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-slate-400">
                        Product ID: {item.product.id}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="p-4 text-slate-300">
                  {item.product.category || "General"}
                </td>

                <td className="p-4 font-semibold">
                  R {item.product.price.toFixed(2)}
                </td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      item.product.active === false
                        ? "bg-red-500/20 text-red-400"
                        : "bg-green-500/20 text-green-400"
                    }`}
                  >
                    {item.product.active === false ? "Inactive" : "Active"}
                  </span>
                </td>

                <td className="p-4">{item.quantityAvailable}</td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${getStockStyle(
                      item.quantityAvailable
                    )}`}
                  >
                    {getStockLabel(item.quantityAvailable)}
                  </span>
                </td>

                <td className="p-4">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => openEditModal(item)}
                      className="inline-flex items-center gap-1 rounded-lg bg-slate-700 px-3 py-2 text-sm text-slate-200 hover:bg-slate-600"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </button>

                    <button
                      onClick={() => handleQuickStockUpdate(item)}
                      className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-500"
                    >
                      Stock
                    </button>

                    <button
                      onClick={() => handleObsolete(item)}
                      disabled={item.product.active === false}
                      className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Archive className="h-4 w-4" />
                      Obsolete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filteredInventory.length === 0 && (
              <tr>
                <td colSpan={7} className="p-6 text-center text-slate-400">
                  No inventory found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-3xl rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                {modalMode === "create" ? "Add Product" : "Edit Product"}
              </h2>

              <button
                onClick={closeModal}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-slate-400">
                    Name
                  </label>
                  <input
                    required
                    value={form.name}
                    onChange={(event) =>
                      setForm({ ...form, name: event.target.value })
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-400">
                    Category
                  </label>
                  <input
                    required
                    value={form.category}
                    onChange={(event) =>
                      setForm({ ...form, category: event.target.value })
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-400">
                    Price
                  </label>
                  <input
                    required
                    min="0"
                    step="0.01"
                    type="number"
                    value={form.price}
                    onChange={(event) =>
                      setForm({ ...form, price: Number(event.target.value) })
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-400">
                    Stock Quantity
                  </label>
                  <input
                    required
                    min="0"
                    type="number"
                    value={form.initialStock ?? 0}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        initialStock: Number(event.target.value),
                      })
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm text-slate-400">
                    Image URL
                  </label>
                  <input
                    value={form.imageUrl}
                    onChange={(event) =>
                      setForm({ ...form, imageUrl: event.target.value })
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm text-slate-400">
                    Description
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(event) =>
                      setForm({ ...form, description: event.target.value })
                    }
                    rows={4}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
                  />
                </div>

                <label className="flex items-center gap-3 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    checked={form.active}
                    onChange={(event) =>
                      setForm({ ...form, active: event.target.checked })
                    }
                    className="h-4 w-4"
                  />
                  Product is active and visible to customers
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl bg-slate-700 px-4 py-3 font-semibold text-slate-200 hover:bg-slate-600"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-500 disabled:opacity-60"
                >
                  <Save className="h-5 w-5" />
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}