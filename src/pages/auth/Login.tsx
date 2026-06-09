import type { FormEvent } from "react";
import { useState } from "react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import HealthBadge from "../../components/HealthBadge";
import { login, saveAuth } from "../../services/authService";

const DEMO_EMAIL = "admin2@ecommerce.local";
const DEMO_PASSWORD = "Admin@12345";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState(DEMO_EMAIL);
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const auth = await login({
        email: email.trim(),
        password,
      });

      saveAuth(auth);

      const redirectPath =
        location.state?.from?.pathname ||
        (auth.role === "ADMIN" ? "/admin" : "/customer/products");

      navigate(redirectPath, { replace: true });
    } catch {
      setError(
        "Sign in failed. Please check the credentials and make sure the live API is online."
      );
    } finally {
      setLoading(false);
    }
  }

  function useDemoCredentials() {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
    setError("");
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-white">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
            Live Portfolio Demo
          </div>
        </div>

        <div className="mb-4">
          <HealthBadge />
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
          <h1 className="text-3xl font-bold mb-2">E-Commerce Admin</h1>
          <p className="text-slate-400 mb-6">
            Sign in to explore the deployed Spring Boot + React dashboard.
          </p>

          <div className="mb-6 rounded-xl border border-slate-700 bg-slate-800/70 p-4">
            <p className="text-sm font-semibold text-slate-200 mb-2">
              Demo credentials
            </p>

            <div className="space-y-1 text-sm text-slate-400">
              <p>
                Email: <span className="text-slate-200">{DEMO_EMAIL}</span>
              </p>
              <p>
                Password: <span className="text-slate-200">{DEMO_PASSWORD}</span>
              </p>
            </div>

            <button
              type="button"
              onClick={useDemoCredentials}
              className="mt-3 text-sm text-blue-400 hover:text-blue-300"
            >
              Use demo credentials
            </button>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-300 p-4 rounded-xl mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-2">Email</label>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />

                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-12 pr-4 py-3 outline-none focus:border-blue-500 transition"
                  placeholder="admin2@ecommerce.local"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-2">
                Password
              </label>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-12 pr-12 py-3 outline-none focus:border-blue-500 transition"
                  placeholder="Enter password"
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed px-4 py-3 rounded-xl font-semibold transition"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-xs text-slate-500 mt-6 text-center">
            The status badge checks the Spring Boot health endpoint directly.
          </p>
        </div>
      </div>
    </div>
  );
}