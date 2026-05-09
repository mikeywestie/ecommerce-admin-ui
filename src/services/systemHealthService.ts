import api from "./api";
import type { HealthStatus } from "../types/HealthStatus";

export async function getSystemHealth(): Promise<HealthStatus> {
  const response = await api.get("/actuator/health");
  return response.data;
}