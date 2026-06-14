import api from "./api";
import type { DashboardSummary } from "../types/DashboardSummary";

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const response = await api.get("/api/dashboard/summary");
  return response.data;
}
