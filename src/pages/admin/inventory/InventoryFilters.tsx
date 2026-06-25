import { Search, SlidersHorizontal } from "lucide-react";

interface InventoryFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  categoryFilter: string;
  onCategoryChange: (value: string) => void;
  categories: string[];
  statusFilter: string;
  onStatusChange: (value: string) => void;
  stockFilter: string;
  onStockChange: (value: string) => void;
}

export default function InventoryFilters({
  search,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  categories,
  statusFilter,
  onStatusChange,
  stockFilter,
  onStockChange,
}: InventoryFiltersProps) {
  return (
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
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search product, description or category..."
            className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-10 pr-4 text-white outline-none focus:border-blue-500"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(event) => onCategoryChange(event.target.value)}
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
          onChange={(event) => onStatusChange(event.target.value)}
          className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
        >
          <option value="ALL">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>

        <select
          value={stockFilter}
          onChange={(event) => onStockChange(event.target.value)}
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
  );
}
