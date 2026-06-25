import { Archive, Edit } from "lucide-react";

import Button from "@/components/ui/Button";
import StatusBadge from "@/components/ui/StatusBadge";
import type { InventoryItem } from "@/types/Inventory";
import { STOCK_THRESHOLD_LOW, STOCK_THRESHOLD_OUT, STOCK_THRESHOLD_WARNING } from "./useInventory";

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

interface InventoryCardProps {
  item: InventoryItem;
  onEdit: (item: InventoryItem) => void;
  onStock: (item: InventoryItem) => void;
  onObsolete: (item: InventoryItem) => void;
}

export default function InventoryCard({ item, onEdit, onStock, onObsolete }: InventoryCardProps) {
  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900/85 p-4 shadow-sm transition hover:border-slate-700 hover:bg-slate-900">
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
            onClick={() => onEdit(item)}
            icon={<Edit className="h-4 w-4" />}
          >
            Edit
          </Button>

          <Button variant="ghost" onClick={() => onStock(item)}>
            Stock
          </Button>

          <Button
            variant="dangerGhost"
            onClick={() => onObsolete(item)}
            disabled={item.product.active === false}
            icon={<Archive className="h-4 w-4" />}
          >
            Obsolete
          </Button>
        </div>
      </div>
    </article>
  );
}
