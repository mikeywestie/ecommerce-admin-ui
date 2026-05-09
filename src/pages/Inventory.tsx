import { useEffect, useState } from "react";

import type { InventoryItem } from "../types/Inventory";
import { getInventory } from "../services/inventoryService";

export default function Inventory() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  function getStockStyle(quantity: number) {
    if (quantity <= 10) {
      return "bg-red-500/20 text-red-400";
    }

    if (quantity <= 20) {
      return "bg-yellow-500/20 text-yellow-400";
    }

    return "bg-green-500/20 text-green-400";
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Inventory</h1>

        <div className="bg-red-500/20 border border-red-500 text-red-400 p-4 rounded-xl">
          {error}
        </div>

        <button
          onClick={loadInventory}
          className="mt-4 bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-xl"
        >
          Retry
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Inventory</h1>

        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-16 bg-slate-800 rounded-xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Inventory</h1>

      <div className="bg-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-900">
            <tr>
              <th className="text-left p-4">Inventory ID</th>
              <th className="text-left p-4">Product</th>
              <th className="text-left p-4">Price</th>
              <th className="text-left p-4">Quantity</th>
              <th className="text-left p-4">Stock Status</th>
            </tr>
          </thead>

          <tbody>
            {inventory.map((item) => (
              <tr
                key={item.inventoryId}
                className="border-t border-slate-700 hover:bg-slate-700 transition"
              >
                <td className="p-4">{item.inventoryId}</td>
                <td className="p-4">{item.product.name}</td>
                <td className="p-4">
                  R {item.product.price.toFixed(2)}
                </td>
                <td className="p-4">{item.quantityAvailable}</td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${getStockStyle(
                      item.quantityAvailable
                    )}`}
                  >
                    {item.quantityAvailable <= 10
                      ? "Low Stock"
                      : item.quantityAvailable <= 20
                      ? "Warning"
                      : "In Stock"}
                  </span>
                </td>
              </tr>
            ))}

            {inventory.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-slate-400">
                  No inventory found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}