import api from "./api";
import type { InventoryItem } from "../types/Inventory";

export async function getInventory(): Promise<InventoryItem[]> {
  const response = await api.get("/api/inventory");
  return response.data;
}