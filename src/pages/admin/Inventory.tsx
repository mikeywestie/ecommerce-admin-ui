import { PackagePlus } from "lucide-react";

import Button from "@/components/ui/Button";
import Notice from "@/components/ui/Notice";
import PageHeader from "@/components/ui/PageHeader";
import PaginationControls from "@/components/ui/PaginationControls";
import ConfirmObsoleteModal from "./inventory/ConfirmObsoleteModal";
import InventoryCard from "./inventory/InventoryCard";
import InventoryFilters from "./inventory/InventoryFilters";
import ProductFormModal from "./inventory/ProductFormModal";
import StockModal from "./inventory/StockModal";
import { useInventory } from "./inventory/useInventory";

export default function Inventory() {
  const {
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
  } = useInventory();

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

      <InventoryFilters
        search={search}
        onSearchChange={(value) => {
          setSearch(value);
          resetPaging();
        }}
        categoryFilter={categoryFilter}
        onCategoryChange={(value) => {
          setCategoryFilter(value);
          resetPaging();
        }}
        categories={categories}
        statusFilter={statusFilter}
        onStatusChange={(value) => {
          setStatusFilter(value);
          resetPaging();
        }}
        stockFilter={stockFilter}
        onStockChange={(value) => {
          setStockFilter(value);
          resetPaging();
        }}
      />

      <div className="space-y-3">
        {paginatedInventory.map((item) => (
          <InventoryCard
            key={item.inventoryId}
            item={item}
            onEdit={openEditModal}
            onStock={handleQuickStockUpdate}
            onObsolete={handleObsolete}
          />
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
        <ConfirmObsoleteModal
          item={confirmModal.item}
          onConfirm={confirmObsolete}
          onCancel={() => setConfirmModal(null)}
        />
      )}

      {stockModal && (
        <StockModal
          item={stockModal.item}
          value={stockModal.value}
          onChange={(value) => setStockModal({ ...stockModal, value })}
          onConfirm={confirmStockUpdate}
          onCancel={() => setStockModal(null)}
        />
      )}

      {modalMode && (
        <ProductFormModal
          mode={modalMode}
          form={form}
          saving={saving}
          onChange={setForm}
          onSubmit={handleSubmit}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
