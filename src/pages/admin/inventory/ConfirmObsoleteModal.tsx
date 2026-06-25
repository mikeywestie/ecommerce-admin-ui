import { Archive } from "lucide-react";

import Button from "@/components/ui/Button";
import type { InventoryItem } from "@/types/Inventory";

interface ConfirmObsoleteModalProps {
  item: InventoryItem;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmObsoleteModal({
  item,
  onConfirm,
  onCancel,
}: ConfirmObsoleteModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-950 p-6 shadow-2xl">
        <h2 className="mb-2 text-lg font-bold text-white">Mark as Obsolete?</h2>
        <p className="mb-6 text-sm text-slate-400">
          This will mark <span className="font-semibold text-white">{item.product.name}</span> as
          inactive and hide it from the storefront.
        </p>
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="dangerGhost" onClick={onConfirm} icon={<Archive className="h-4 w-4" />}>
            Mark Obsolete
          </Button>
        </div>
      </div>
    </div>
  );
}
