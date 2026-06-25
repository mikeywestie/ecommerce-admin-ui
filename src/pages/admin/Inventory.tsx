import type { FormEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Archive, Edit, PackagePlus, Save, Search, SlidersHorizontal, X } from "lucide-react";

import Button from "@/components/ui/Button";
import Notice from "@/components/ui/Notice";
import PageHeader from "@/components/ui/PageHeader";
import PaginationControls from "@/components/ui/PaginationControls";
import StatusBadge from "@/components/ui/StatusBadge";
import type { InventoryItem, ProductFormPayload } from "@/types/Inventory";
import {
  createProduct,
  getInventory,
  obsoleteProduct,
  setStockQuantity,
  updateProduct,
} from "../../services/inventoryService";

const STOCK_THRESHOLD_OUT = 0;
const STOCK_THRESHOLD_LOW = 5;
const STOCK_THRESHOLD_WARNING = 10;

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

type ConfirmModal = { item: InventoryItem } | null;
type StockModal = { item: InventoryItem; value: string } | null;

function getStockTone(quantity: number) {
  if (quantity <= STOCK_THRESHOLD_LOW) return "red";
  if (quantity <= STOCK_THRESHOLD_WARNING) return "yellow";
  return "green";
}

function getStockLabel(quantity: number) {
  if (quantity <= STOCK_THRESHOLD_OUT) return "Out of Stock";
  if (quantity <= STOCK_THRESHOLD_LOW) return "Low Stock";
  if (quantity <= STOCK_THRESHOLD_WARNING) return "Almost Sold Out";
  return "In Stock";
}

export default function Inventory() {
  const [searchParams] = useSearchParams();

  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [stockFilter, setStockFilter] = useState(searchParams.get("stock") ?? "ALL");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [form, setForm] = useState<ProductFormPayload>(emptyForm);

  const [confirmModal, setConfirmModal] = useState<ConfirmModal>(null);
  const [stockModal, setStockModal] = useState<StockModal>(null);
  const stockInputRef = useRef<HTMLInputElement>(null);

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
      new Set(inventory.map((item) => item.product.category || "General").filter(Boolean))
    ).sort();
  }, [inventory]);

  const filteredInventory = useMemo(() => {
    return inventory.filter((item) => {
      const product = item.product;
      const query = search.trim().toLowerCase();

      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        (product.category || "").toLowerCase().includes(query) ||
        (product.description || "").toLowerCase().includes(query);

      const matchesCategory =
        categoryFilter === "ALL" || (product.category || "General") === categoryFilter;

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" && product.active !== false) ||
        (statusFilter === "INACTIVE" && product.active === false);

      const matchesStock =
        stockFilter === "ALL" ||
        (stockFilter === "ALERTS" && item.quantityAvailable <= STOCK_THRESHOLD_WARNING) ||
        (stockFilter === "OUT" && item.quantityAvailable <= 0) ||
        (stockFilter === "LOW" &&
          item.quantityAvailable > STOCK_THRESHOLD_OUT &&
          item.quantityAvailable <= STOCK_THRESHOLD_LOW) ||
        (stockFilter === "WARNING" &&
          item.quantityAvailable > STOCK_THRESHOLD_LOW &&
          item.quantityAvailable <= STOCK_THRESHOLD_WARNING) ||
        (stockFilter === "IN_STOCK" && item.quantityAvailable > 10);

      return matchesSearch && matchesCategory && matchesStatus && matchesStock;
    });
  }, [inventory, search, categoryFilter, statusFilter, stockFilter]);

  const paginatedInventory = filteredInventory.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  function resetPaging() {
    setCurrentPage(1);
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
          imageUrl: form.imageUrl?.trim() || "",
          initialStock: form.initialStock ?? 0,
        });

        setSuccess("Product created successfully.");
      }

      if (modalMode === "edit" && selectedItem) {
        await updateProduct(selectedItem.product.id, {
          ...form,
          imageUrl: form.imageUrl?.trim() || "",
          initialStock: null,
        });

        await setStockQuantity(selectedItem.product.id, Number(form.initialStock ?? 0));

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

  function handleObsolete(item: InventoryItem) {
    setConfirmModal({ item });
  }

  async function confirmObsolete() {
    if (!confirmModal) return;

    const { item } = confirmModal;
    setConfirmModal(null);

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

  function handleQuickStockUpdate(item: InventoryItem) {
    setStockModal({ item, value: String(item.quantityAvailable) });
    setTimeout(() => stockInputRef.current?.focus(), 50);
  }

  async function confirmStockUpdate() {
    if (!stockModal) return;

    const quantity = Number(stockModal.value);

    if (Number.isNaN(quantity) || quantity < 0) {
      setError("Stock quantity must be zero or greater.");
      setStockModal(null);
      return;
    }

    const { item } = stockModal;
    setStockModal(null);

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
      <div>
        <PageHeader title="Inventory" description="Loading catalog and stock data..." />
        <div className="grid gap-4 lg:grid-cols-2">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-32 animate-pulse rounded-2xl border border-slate-800 bg-slate-800"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Inventory"
        description="Manage products, stock levels, catalog visibility, and product status using one responsive layout across mobile and desktop."
        action={
          <Button
            onClick={openCreateModal}
            variant="primary"
            size="lg"
            icon={<PackagePlus className="h-5 w-5" />}
            className="w-full sm:w-auto"
          >
            Add Product
          </Button>
        }
      />

      <div className="mb-5 space-y-3">
        {error && <Notice tone="error">{error}</Notice>}
        {success && <Notice tone="success">{success}</Notice>}
      </div>

      <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-sm">
        <div className="mb-3 flex items-center gap-2 font-semibold text-slate-200">
          <SlidersHorizontal className="h-5 w-5" />
          Filters
        </div>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                resetPaging();
              }}
              placeholder="Search product, description or category..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-10 pr-4 text-white outline-none focus:border-blue-500"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(event) => {
              setCategoryFilter(event.target.value);
              resetPaging();
            }}
            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
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
            onChange={(event) => {
              setStatusFilter(event.target.value);
              resetPaging();
            }}
            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>

          <select
            value={stockFilter}
            onChange={(event) => {
              setStockFilter(event.target.value);
              resetPaging();
            }}
            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
          >
            <option value="ALL">All Stock Levels</option>
            <option value="ALERTS">Inventory Alerts</option>
            <option value="OUT">Out of Stock</option>
            <option value="LOW">Low Stock</option>
            <option value="WARNING">Almost Sold Out</option>
            <option value="IN_STOCK">In Stock</option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
        {paginatedInventory.map((item) => (
          <article
            key={item.inventoryId}
            className="rounded-2xl border border-slate-800 bg-slate-900/85 p-4 shadow-sm transition hover:border-slate-700 hover:bg-slate-900"
          >
            <div className="grid gap-4 lg:grid-cols-[1.4fr_0.75fr_0.7fr_auto] lg:items-center">
              <div className="min-w-0">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <StatusBadge tone={item.product.active === false ? "red" : "green"}>
                    {item.product.active === false ? "Inactive" : "Active"}
                  </StatusBadge>
                  <StatusBadge tone={getStockTone(item.quantityAvailable)}>
                    {getStockLabel(item.quantityAvailable)}
                  </StatusBadge>
                  <span className="text-xs text-slate-500">Product #{item.product.id}</span>
                </div>

                <h2 className="text-lg font-bold text-white">{item.product.name}</h2>

                <p className="mt-1 line-clamp-2 text-sm text-slate-400">
                  {item.product.description || "No description captured yet."}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Category</p>
                <p className="font-semibold text-slate-200">{item.product.category || "General"}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">Price</p>
                  <p className="font-bold text-blue-300">R {item.product.price.toFixed(2)}</p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">Qty</p>
                  <p className="font-bold text-white">{item.quantityAvailable}</p>
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row lg:justify-end">
                <Button
                  variant="secondary"
                  onClick={() => openEditModal(item)}
                  icon={<Edit className="h-4 w-4" />}
                >
                  Edit
                </Button>

                <Button variant="ghost" onClick={() => handleQuickStockUpdate(item)}>
                  Stock
                </Button>

                <Button
                  variant="dangerGhost"
                  onClick={() => handleObsolete(item)}
                  disabled={item.product.active === false}
                  icon={<Archive className="h-4 w-4" />}
                >
                  Obsolete
                </Button>
              </div>
            </div>
          </article>
        ))}

        {paginatedInventory.length === 0 && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-400">
            No inventory found.
          </div>
        )}
      </div>

      <PaginationControls
        page={currentPage}
        pageSize={pageSize}
        totalItems={filteredInventory.length}
        itemLabel="inventory items"
        onPageChange={setCurrentPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setCurrentPage(1);
        }}
      />

      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-950 p-6 shadow-2xl">
            <h2 className="mb-2 text-lg font-bold text-white">Mark as Obsolete?</h2>
            <p className="mb-6 text-sm text-slate-400">
              This will mark{" "}
              <span className="font-semibold text-white">{confirmModal.item.product.name}</span> as
              inactive and hide it from the storefront.
            </p>
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button variant="ghost" onClick={() => setConfirmModal(null)}>
                Cancel
              </Button>
              <Button
                variant="dangerGhost"
                onClick={confirmObsolete}
                icon={<Archive className="h-4 w-4" />}
              >
                Mark Obsolete
              </Button>
            </div>
          </div>
        </div>
      )}

      {stockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-950 p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="text-lg font-bold text-white">Update Stock</h2>
              <button
                type="button"
                onClick={() => setStockModal(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mb-4 text-sm text-slate-400">
              Set stock quantity for{" "}
              <span className="font-semibold text-white">{stockModal.item.product.name}</span>.
            </p>
            <label>
              <span className="mb-2 block text-sm text-slate-400">Quantity</span>
              <input
                ref={stockInputRef}
                type="number"
                min="0"
                value={stockModal.value}
                onChange={(e) => setStockModal({ ...stockModal, value: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && confirmStockUpdate()}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-500"
              />
            </label>
            <div className="mt-4 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button variant="ghost" onClick={() => setStockModal(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={confirmStockUpdate}
                icon={<Save className="h-4 w-4" />}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}

      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 md:items-center">
          <div className="w-full max-w-3xl rounded-2xl border border-slate-700 bg-slate-950 p-5 shadow-2xl md:p-6">
            <div className="mb-6 flex items-center justify-between gap-4">
              <h2 className="text-xl font-bold text-white md:text-2xl">
                {modalMode === "create" ? "Add Product" : "Edit Product"}
              </h2>

              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {form.imageUrl?.trim() && (
              <div className="mb-5 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
                <img
                  src={form.imageUrl}
                  alt={form.name || "Product preview"}
                  className="h-48 w-full object-cover"
                />
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <label>
                  <span className="mb-2 block text-sm text-slate-400">Name</span>
                  <input
                    required
                    value={form.name}
                    onChange={(event) => setForm({ ...form, name: event.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-500"
                  />
                </label>

                <label>
                  <span className="mb-2 block text-sm text-slate-400">Category</span>
                  <input
                    required
                    value={form.category}
                    onChange={(event) => setForm({ ...form, category: event.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-500"
                  />
                </label>

                <label>
                  <span className="mb-2 block text-sm text-slate-400">Price</span>
                  <input
                    required
                    min="0"
                    step="0.01"
                    type="number"
                    value={form.price}
                    onChange={(event) => setForm({ ...form, price: Number(event.target.value) })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-500"
                  />
                </label>

                <label>
                  <span className="mb-2 block text-sm text-slate-400">Stock Quantity</span>
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
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-500"
                  />
                </label>

                <label className="md:col-span-2">
                  <span className="mb-2 block text-sm text-slate-400">Image URL</span>
                  <input
                    value={form.imageUrl}
                    onChange={(event) => setForm({ ...form, imageUrl: event.target.value })}
                    placeholder="Optional. Preview appears here when populated."
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-500"
                  />
                </label>

                <label className="md:col-span-2">
                  <span className="mb-2 block text-sm text-slate-400">Description</span>
                  <textarea
                    value={form.description}
                    onChange={(event) => setForm({ ...form, description: event.target.value })}
                    rows={4}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-500"
                  />
                </label>

                <label className="flex items-center gap-3 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    checked={form.active}
                    onChange={(event) => setForm({ ...form, active: event.target.checked })}
                    className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-blue-600"
                  />
                  Active product
                </label>
              </div>

              <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-end">
                <Button variant="ghost" onClick={closeModal}>
                  Cancel
                </Button>

                <Button
                  type="submit"
                  variant="primary"
                  disabled={saving}
                  icon={<Save className="h-4 w-4" />}
                >
                  {saving ? "Saving..." : "Save Product"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
