import api from "./api";
import type { Order } from "../types/Order";

export async function getOrders(): Promise<Order[]> {
  const response = await api.get("/api/orders");
  return response.data;
}