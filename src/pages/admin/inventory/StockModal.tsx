import { useEffect, useRef } from "react";
import { Save, X } from "lucide-react";

import Button from "@/components/ui/Button";
import type { InventoryItem } from "@/types/Inventory";

interface StockModalProps {
  item: InventoryItem;
  value: string;
  onChange: (value: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function StockModal({ item, value, onChange, onConfirm, onCancel }: StockModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const id = setTimeout(() => inputRef.current?.focus(), 50);
    return () => clearTimeout(id);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-950 p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-white">Update Stock</h2>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="mb-4 text-sm text-slate-400">
          Set stock quantity for{" "}
          <span className="font-semibold text-white">{item.product.name}</span>.
        </p>
        <label>
          <span className="mb-2 block text-sm text-slate-400">Quantity</span>
          <input
            ref={inputRef}
            type="number"
            min="0"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onConfirm()}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-500"
          />
        </label>
        <div className="mt-4 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={onConfirm} icon={<Save className="h-4 w-4" />}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
