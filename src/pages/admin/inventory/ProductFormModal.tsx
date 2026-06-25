import type { FormEvent } from "react";
import { Save, X } from "lucide-react";

import Button from "@/components/ui/Button";
import type { ProductFormPayload } from "@/types/Inventory";

interface ProductFormModalProps {
  mode: "create" | "edit";
  form: ProductFormPayload;
  saving: boolean;
  onChange: (form: ProductFormPayload) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
}

export default function ProductFormModal({
  mode,
  form,
  saving,
  onChange,
  onSubmit,
  onClose,
}: ProductFormModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 md:items-center">
      <div className="w-full max-w-3xl rounded-2xl border border-slate-700 bg-slate-950 p-5 shadow-2xl md:p-6">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-white md:text-2xl">
            {mode === "create" ? "Add Product" : "Edit Product"}
          </h2>

          <button
            type="button"
            onClick={onClose}
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

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label>
              <span className="mb-2 block text-sm text-slate-400">Name</span>
              <input
                required
                value={form.name}
                onChange={(e) => onChange({ ...form, name: e.target.value })}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-500"
              />
            </label>

            <label>
              <span className="mb-2 block text-sm text-slate-400">Category</span>
              <input
                required
                value={form.category}
                onChange={(e) => onChange({ ...form, category: e.target.value })}
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
                onChange={(e) => onChange({ ...form, price: Number(e.target.value) })}
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
                onChange={(e) => onChange({ ...form, initialStock: Number(e.target.value) })}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-500"
              />
            </label>

            <label className="md:col-span-2">
              <span className="mb-2 block text-sm text-slate-400">Image URL</span>
              <input
                value={form.imageUrl}
                onChange={(e) => onChange({ ...form, imageUrl: e.target.value })}
                placeholder="Optional. Preview appears here when populated."
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-500"
              />
            </label>

            <label className="md:col-span-2">
              <span className="mb-2 block text-sm text-slate-400">Description</span>
              <textarea
                value={form.description}
                onChange={(e) => onChange({ ...form, description: e.target.value })}
                rows={4}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-500"
              />
            </label>

            <label className="flex items-center gap-3 text-sm text-slate-300">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => onChange({ ...form, active: e.target.checked })}
                className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-blue-600"
              />
              Active product
            </label>
          </div>

          <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-end">
            <Button variant="ghost" onClick={onClose}>
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
  );
}
