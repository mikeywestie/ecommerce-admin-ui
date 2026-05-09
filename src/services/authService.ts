import api from "./api";
import type { AuthResponse, LoginRequest } from "../types/Auth";

export async function login(request: LoginRequest): Promise<AuthResponse> {
  const response = await api.post("/api/auth/login", request);
  return response.data;
}

export function saveAuth(auth: AuthResponse) {
  localStorage.setItem("token", auth.token);
  localStorage.setItem("email", auth.email);
  localStorage.setItem("role", auth.role);
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("email");
  localStorage.removeItem("role");
}

export function getToken() {
  return localStorage.getItem("token");
}

export function isAuthenticated() {
  return !!getToken();
}