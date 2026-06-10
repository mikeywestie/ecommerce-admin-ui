import api from "./api";
import type { InventoryItem, ProductFormPayload } from "../types/Inventory";

export async function getInventory(): Promise<InventoryItem[]> {
  const response = await api.get("/api/inventory");
  return response.data;
}

export async function createProduct(payload: ProductFormPayload) {
  const response = await api.post("/api/products", payload);
  return response.data;
}

export async function updateProduct(
  productId: number,
  payload: ProductFormPayload
) {
  const response = await api.put(`/api/products/${productId}`, payload);
  return response.data;
}

export async function obsoleteProduct(productId: number) {
  const response = await api.delete(`/api/products/${productId}`);
  return response.data;
}

export async function setStockQuantity(productId: number, quantity: number) {
  const response = await api.put(`/api/inventory/${productId}/quantity`, {
    quantity,
  });

  return response.data;
}