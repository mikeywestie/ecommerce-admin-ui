import api from "./api";
import type { BackendBuildInfo } from "@/types/BuildInfo";

export async function getBackendBuildInfo(): Promise<BackendBuildInfo> {
  const response = await api.get("/api/system/build-info");
  return response.data;
}
