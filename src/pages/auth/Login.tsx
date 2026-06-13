import type { FormEvent } from "react";
import { useState } from "react";
import {
  BookOpenText,
  Eye,
  EyeOff,
  FileText,
  Lock,
  Mail,
  ShieldCheck,
  ShoppingBag,
  UserRound,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import HealthBadge from "../../components/HealthBadge";
import { login, saveAuth } from "../../services/authService";

import DemoDocumentationModal from "../../components/DemoDocumentationModal";

const ADMIN_EMAIL = "admin2@ecommerce.local";
const ADMIN_PASSWORD = "Admin@12345";

const CUSTOMER_EMAIL = "customer@ecommerce.local";
const CUSTOMER_PASSWORD = "Customer@12345";

type DemoMode = "admin" | "customer";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState(ADMIN_PASSWORD);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedDemo, setSelectedDemo] = useState<DemoMode>("admin");
  const [isInfoOpen, setIsInfoOpen] = useState(false);
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

  function useAdminDemo() {
    setSelectedDemo("admin");
    setEmail(ADMIN_EMAIL);
    setPassword(ADMIN_PASSWORD);
    setError("");
  }

  function useCustomerDemo() {
    setSelectedDemo("customer");
    setEmail(CUSTOMER_EMAIL);
    setPassword(CUSTOMER_PASSWORD);
    setError("");
  }

  function openInfo() {
    setIsInfoOpen(true);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        <section className="hidden lg:flex flex-col justify-between border-r border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-10">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
                <ShieldCheck className="h-4 w-4" />
                Live Portfolio Demo
              </div>

              <button
                type="button"
                onClick={openInfo}
                className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/70 px-4 py-2 text-sm text-slate-200 transition hover:border-blue-500/60 hover:bg-blue-500/10 hover:text-blue-200"
              >
                <BookOpenText className="h-4 w-4" />
                README / Release Notes
              </button>
            </div>

            <h1 className="mt-10 text-5xl font-bold leading-tight">
              Full-stack e-commerce platform.
            </h1>

            <p className="mt-5 max-w-xl text-lg text-slate-300">
              Explore a deployed Spring Boot API, React storefront, admin
              dashboard, cart, checkout, coupons, stock validation, and payment
              simulation.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5">
              <p className="text-sm text-slate-400">Backend</p>
              <p className="mt-2 text-2xl font-bold">Spring Boot</p>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5">
              <p className="text-sm text-slate-400">Frontend</p>
              <p className="mt-2 text-2xl font-bold">React</p>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5">
              <p className="text-sm text-slate-400">Database</p>
              <p className="mt-2 text-2xl font-bold">PostgreSQL</p>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5">
              <p className="text-sm text-slate-400">Deployment</p>
              <p className="mt-2 text-2xl font-bold">Render + Pages</p>
            </div>
          </div>
        </section>

        <main className="flex items-center justify-center p-4 sm:p-6">
          <div className="w-full max-w-md">
            <div className="mb-5 text-center lg:hidden">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
                <ShieldCheck className="h-4 w-4" />
                Live Portfolio Demo
              </div>
            </div>

            <div className="mb-4">
              <HealthBadge />
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-2xl sm:p-8">
              <div className="mb-6">
                <h1 className="text-3xl font-bold">Sign in</h1>
                <p className="mt-2 text-slate-400">
                  Choose an admin or customer demo account.
                </p>
              </div>

              <button
                type="button"
                 onClick={openInfo}
                className="mb-6 flex w-full items-center gap-3 rounded-xl border border-blue-500/30 bg-blue-500/10 p-4 text-left transition hover:border-blue-400/70 hover:bg-blue-500/20"
              >
                <FileText className="h-5 w-5 text-blue-300" />
                <span>
                  <span className="block font-semibold text-slate-100">
                    View README / Release Notes
                  </span>
                  <span className="text-xs text-slate-400">
                    Project overview, demo notes, known issues, and roadmap.
                  </span>
                </span>
              </button>

              <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={useAdminDemo}
                  className={`rounded-2xl border p-4 text-left transition ${
                    selectedDemo === "admin"
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-slate-700 bg-slate-800/70 hover:bg-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-5 w-5 text-blue-400" />
                    <div>
                      <p className="font-semibold">Admin Demo</p>
                      <p className="text-xs text-slate-400">
                        Dashboard & inventory
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={useCustomerDemo}
                  className={`rounded-2xl border p-4 text-left transition ${
                    selectedDemo === "customer"
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-slate-700 bg-slate-800/70 hover:bg-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ShoppingBag className="h-5 w-5 text-emerald-400" />
                    <div>
                      <p className="font-semibold">Customer Demo</p>
                      <p className="text-xs text-slate-400">
                        Storefront & checkout
                      </p>
                    </div>
                  </div>
                </button>
              </div>

              <div className="mb-6 rounded-xl border border-slate-700 bg-slate-800/70 p-4">
                <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-200">
                  <UserRound className="h-4 w-4" />
                  Selected credentials
                </p>

                <div className="space-y-1 text-sm text-slate-400">
                  <p>
                    Email: <span className="text-slate-200">{email}</span>
                  </p>
                  <p>
                    Password: <span className="text-slate-200">{password}</span>
                  </p>
                </div>
              </div>

              {error && (
                <div className="mb-4 rounded-xl border border-red-500 bg-red-500/20 p-4 text-sm text-red-300">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm text-slate-400">
                    Email
                  </label>

                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />

                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 py-3 pl-12 pr-4 text-white outline-none transition focus:border-blue-500"
                      placeholder="admin2@ecommerce.local"
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-400">
                    Password
                  </label>

                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />

                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 py-3 pl-12 pr-12 text-white outline-none transition focus:border-blue-500"
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
                  className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? "Signing in..."
                    : selectedDemo === "admin"
                    ? "Sign In as Admin"
                    : "Sign In as Customer"}
                </button>
              </form>

              <p className="mt-6 text-center text-xs text-slate-500">
                The status badge checks the live Spring Boot health endpoint.
              </p>
            </div>
          </div>
        </main>
      </div>

      {isInfoOpen && (
        <DemoDocumentationModal
          onClose={() => setIsInfoOpen(false)}
        />
      )}
    </div>
  );
}

type InfoPillProps = {
  label: string;
  value: string;
};
