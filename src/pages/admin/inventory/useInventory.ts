import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import type { InventoryItem, ProductFormPayload } from "@/types/Inventory";
import {
  createProduct,
  getInventory,
  obsoleteProduct,
  setStockQuantity,
  updateProduct,
} from "../../../services/inventoryService";

export const STOCK_THRESHOLD_OUT = 0;
export const STOCK_THRESHOLD_LOW = 5;
export const STOCK_THRESHOLD_WARNING = 10;

export type ModalMode = "create" | "edit" | null;
export type ConfirmModalState = { item: InventoryItem } | null;
export type StockModalState = { item: InventoryItem; value: string } | null;

const emptyForm: ProductFormPayload = {
  name: "",
  description: "",
  category: "General",
  imageUrl: "",
  active: true,
  price: 0,
  initialStock: 0,
};

export function useInventory() {
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

  const [confirmModal, setConfirmModal] = useState<ConfirmModalState>(null);
  const [stockModal, setStockModal] = useState<StockModalState>(null);

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
        (stockFilter === "IN_STOCK" && item.quantityAvailable > STOCK_THRESHOLD_WARNING);

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

  return {
    loading,
    saving,
    error,
    success,
    search,
    setSearch,
    categoryFilter,
    setCategoryFilter,
    categories,
    statusFilter,
    setStatusFilter,
    stockFilter,
    setStockFilter,
    filteredInventory,
    paginatedInventory,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    modalMode,
    form,
    setForm,
    confirmModal,
    setConfirmModal,
    stockModal,
    setStockModal,
    openCreateModal,
    openEditModal,
    closeModal,
    handleSubmit,
    handleObsolete,
    confirmObsolete,
    handleQuickStockUpdate,
    confirmStockUpdate,
    resetPaging,
  };
}
