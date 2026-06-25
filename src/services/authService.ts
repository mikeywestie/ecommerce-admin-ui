import api from "./api";
import type { AuthResponse, LoginRequest } from "../types/Auth";

export async function login(request: LoginRequest): Promise<AuthResponse> {
  const response = await api.post("/api/auth/login", request);
  return response.data;
}

export function saveAuth(auth: AuthResponse) {
  sessionStorage.setItem("token", auth.token);
  sessionStorage.setItem("email", auth.email);
  sessionStorage.setItem("role", auth.role);
}

export function logout() {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("email");
  sessionStorage.removeItem("role");
}

export function getToken() {
  return sessionStorage.getItem("token");
}

export function isAuthenticated() {
  return !!getToken();
}
