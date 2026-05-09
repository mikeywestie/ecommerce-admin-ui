import api from "./api";
import type { Payment } from "../types/Payment";

export async function getPayments(): Promise<Payment[]> {
  const response = await api.get("/api/payments");
  return response.data;
}