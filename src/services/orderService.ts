import api from "./api";
import type { Order } from "@/types/Order";

export async function getOrders(): Promise<Order[]> {
  const response = await api.get("/api/orders");
  return response.data;
}

export async function cancelPaidOrder(orderId: number): Promise<Order> {
  const response = await api.post(`/api/orders/${orderId}/cancel-refund`);
  return response.data;
}
