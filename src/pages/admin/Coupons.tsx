import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import {
  BadgePercent,
  Calendar,
  Plus,
  RefreshCw,
  Save,
  TicketPercent,
} from "lucide-react";

import {
  createCoupon,
  getCoupons,
  type CouponResponse,
  type CouponType,
} from "../../services/couponService";

const defaultForm = {
  code: "",
  type: "PERCENTAGE" as CouponType,
  value: 10,
  expiresAt: "2030-12-31",
  reusable: true,
  maxUsesPerCustomer: "",
  maxTotalUses: "",
};

export default function Coupons() {
  const [coupons, setCoupons] = useState<CouponResponse[]>([]);
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadCoupons();
  }, []);

  const totalRedemptions = useMemo(
    () => coupons.reduce((sum, coupon) => sum + coupon.totalRedemptions, 0),
    [coupons]
  );

  const activeCoupons = useMemo(
    () => coupons.filter((coupon) => coupon.active).length,
    [coupons]
  );

  async function loadCoupons() {
    try {
      setLoading(true);
      setError("");

      const data = await getCoupons();
      setCoupons(data);
    } catch {
      setError("Failed to load coupons.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateCoupon(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await createCoupon({
        code: form.code.trim().toUpperCase(),
        type: form.type,
        value: Number(form.value),
        expiresAt: `${form.expiresAt}T23:59:59Z`,
        reusable: form.reusable,
        maxUsesPerCustomer: form.maxUsesPerCustomer
          ? Number(form.maxUsesPerCustomer)
          : null,
        maxTotalUses: form.maxTotalUses ? Number(form.maxTotalUses) : null,
      });

      setSuccess("Coupon created successfully.");
      setForm(defaultForm);
      await loadCoupons();
    } catch {
      setError("Failed to create coupon. Check if the code already exists.");
    } finally {
      setSaving(false);
    }
  }

  function formatValue(coupon: CouponResponse) {
    if (coupon.type === "PERCENTAGE") {
      return `${coupon.value}%`;
    }

    return `R ${coupon.value.toFixed(2)}`;
  }

  function formatDate(value: string) {
    return new Date(value).toLocaleDateString("en-ZA", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-28 rounded-2xl bg-slate-800 animate-pulse" />
        <div className="h-96 rounded-2xl bg-slate-800 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Coupons</h1>
          <p className="text-slate-400 mt-2">
            Create and monitor discount coupons, usage limits, and redemption
            activity.
          </p>
        </div>

        <button
          type="button"
          onClick={loadCoupons}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 font-semibold text-slate-200 transition hover:bg-slate-700 sm:w-auto"
        >
          <RefreshCw className="h-5 w-5" />
          Refresh
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500 bg-red-500/20 p-4 text-red-300">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-xl border border-green-500 bg-green-500/20 p-4 text-green-300">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-slate-800 p-5">
          <p className="text-sm text-slate-400">Total Coupons</p>
          <p className="mt-2 text-3xl font-bold">{coupons.length}</p>
        </div>

        <div className="rounded-2xl bg-slate-800 p-5">
          <p className="text-sm text-slate-400">Active Coupons</p>
          <p className="mt-2 text-3xl font-bold">{activeCoupons}</p>
        </div>

        <div className="rounded-2xl bg-slate-800 p-5">
          <p className="text-sm text-slate-400">Total Redemptions</p>
          <p className="mt-2 text-3xl font-bold">{totalRedemptions}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <form
          onSubmit={handleCreateCoupon}
          className="rounded-2xl border border-slate-700 bg-slate-800 p-5 xl:col-span-1"
        >
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-xl bg-blue-500/20 p-3 text-blue-300">
              <Plus className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-xl font-bold">Create Coupon</h2>
              <p className="text-sm text-slate-400">
                Add a new customer discount rule.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm text-slate-400">Code</label>
              <input
                required
                value={form.code}
                onChange={(event) =>
                  setForm({ ...form, code: event.target.value })
                }
                placeholder="FIRSTBUY"
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-400">Type</label>
              <select
                value={form.type}
                onChange={(event) =>
                  setForm({
                    ...form,
                    type: event.target.value as CouponType,
                  })
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-500"
              >
                <option value="PERCENTAGE">Percentage</option>
                <option value="FIXED_AMOUNT">Fixed Amount</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-400">Value</label>
              <input
                required
                min="0.01"
                step="0.01"
                type="number"
                value={form.value}
                onChange={(event) =>
                  setForm({ ...form, value: Number(event.target.value) })
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-400">
                Expires At
              </label>
              <input
                required
                type="date"
                value={form.expiresAt}
                onChange={(event) =>
                  setForm({ ...form, expiresAt: event.target.value })
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-500"
              />
            </div>

            <label className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-900 p-4 text-sm text-slate-300">
              <input
                type="checkbox"
                checked={form.reusable}
                onChange={(event) =>
                  setForm({ ...form, reusable: event.target.checked })
                }
                className="h-4 w-4"
              />
              Reusable coupon
            </label>

            <div>
              <label className="mb-2 block text-sm text-slate-400">
                Max Uses Per Customer
              </label>
              <input
                min="1"
                type="number"
                value={form.maxUsesPerCustomer}
                onChange={(event) =>
                  setForm({
                    ...form,
                    maxUsesPerCustomer: event.target.value,
                  })
                }
                placeholder="Unlimited"
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-400">
                Max Total Uses
              </label>
              <input
                min="1"
                type="number"
                value={form.maxTotalUses}
                onChange={(event) =>
                  setForm({ ...form, maxTotalUses: event.target.value })
                }
                placeholder="Unlimited"
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:opacity-60"
            >
              <Save className="h-5 w-5" />
              {saving ? "Saving..." : "Create Coupon"}
            </button>
          </div>
        </form>

        <div className="space-y-4 xl:col-span-2">
          {coupons.map((coupon) => (
            <div
              key={coupon.id}
              className="rounded-2xl border border-slate-700 bg-slate-800 p-5"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="rounded-xl bg-blue-500/20 p-3 text-blue-300">
                      <TicketPercent className="h-5 w-5" />
                    </div>

                    <div>
                      <h3 className="text-xl font-bold">{coupon.code}</h3>
                      <p className="text-sm text-slate-400">
                        {coupon.type === "PERCENTAGE"
                          ? "Percentage discount"
                          : "Fixed amount discount"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        coupon.active
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {coupon.active ? "Active" : "Inactive"}
                    </span>

                    <span className="rounded-full bg-slate-700 px-3 py-1 text-xs font-semibold text-slate-300">
                      {coupon.reusable ? "Reusable" : "Single Use"}
                    </span>
                  </div>
                </div>

                <div className="text-left lg:text-right">
                  <p className="text-sm text-slate-400">Value</p>
                  <p className="text-3xl font-bold text-blue-400">
                    {formatValue(coupon)}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-4">
                <div className="rounded-xl bg-slate-900 p-4">
                  <p className="text-xs text-slate-500">Redemptions</p>
                  <p className="mt-1 text-lg font-bold">
                    {coupon.totalRedemptions}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-900 p-4">
                  <p className="text-xs text-slate-500">Per Customer</p>
                  <p className="mt-1 text-lg font-bold">
                    {coupon.maxUsesPerCustomer ?? "Unlimited"}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-900 p-4">
                  <p className="text-xs text-slate-500">Total Limit</p>
                  <p className="mt-1 text-lg font-bold">
                    {coupon.maxTotalUses ?? "Unlimited"}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-900 p-4">
                  <p className="text-xs text-slate-500">Expires</p>
                  <p className="mt-1 flex items-center gap-2 text-lg font-bold">
                    <Calendar className="h-4 w-4 text-slate-500" />
                    {formatDate(coupon.expiresAt)}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {coupons.length === 0 && (
            <div className="rounded-2xl bg-slate-800 p-8 text-center text-slate-400">
              <BadgePercent className="mx-auto mb-4 h-12 w-12 text-slate-500" />
              No coupons created yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}