import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";

import Button from "@/components/ui/Button";
import Notice from "@/components/ui/Notice";
import PageHeader from "@/components/ui/PageHeader";
import PaginationControls from "@/components/ui/PaginationControls";
import StatusBadge from "@/components/ui/StatusBadge";
import type { Payment } from "@/types/Payment";
import { getPayments } from "@/services/paymentService";

function getStatusTone(status: Payment["paymentStatus"]) {
  if (status === "SUCCESS") return "green";
  if (status === "PENDING") return "yellow";
  return "red";
}

export default function Payments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    loadPayments();
  }, []);

  async function loadPayments() {
    try {
      setLoading(true);
      setError("");

      const data = await getPayments();
      setPayments(data);
    } catch {
      setError("Failed to load payments.");
    } finally {
      setLoading(false);
    }
  }

  const filteredPayments = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return payments;

    return payments.filter((payment) => {
      return (
        payment.id.toString().includes(query) ||
        payment.orderId.toString().includes(query) ||
        payment.paymentMethod.toLowerCase().includes(query) ||
        payment.paymentStatus.toLowerCase().includes(query)
      );
    });
  }, [payments, search]);

  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  if (loading) {
    return (
      <div>
        <PageHeader title="Payments" description="Loading payment activity..." />
        <div className="space-y-3">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-24 animate-pulse rounded-2xl border border-slate-800 bg-slate-800"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Payments"
        description="Monitor successful, pending, and failed payment simulations."
      />

      {error && (
        <div className="mb-5 space-y-3">
          <Notice tone="error">{error}</Notice>
          <Button onClick={loadPayments}>Retry</Button>
        </div>
      )}

      <div className="mb-5 rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search payment ID, order ID, method or status..."
            className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-10 pr-4 text-white outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div className="space-y-3">
        {paginatedPayments.map((payment) => (
          <article
            key={payment.id}
            className="rounded-2xl border border-slate-800 bg-slate-900/85 p-4 shadow-sm transition hover:border-slate-700"
          >
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-[0.7fr_0.7fr_1fr_0.8fr_auto] lg:items-center">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Payment
                </p>
                <p className="text-xl font-bold text-white">#{payment.id}</p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Order
                </p>
                <p className="font-semibold text-slate-200">
                  #{payment.orderId}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Method
                </p>
                <p className="font-semibold text-slate-200">
                  {payment.paymentMethod}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Amount
                </p>
                <p className="font-bold text-blue-300">
                  R {payment.amount.toFixed(2)}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                <StatusBadge tone={getStatusTone(payment.paymentStatus)}>
                  {payment.paymentStatus}
                </StatusBadge>
                <span className="text-sm text-slate-500">
                  {new Date(payment.paidAt).toLocaleString()}
                </span>
              </div>
            </div>
          </article>
        ))}

        {paginatedPayments.length === 0 && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-400">
            No payments found.
          </div>
        )}
      </div>

      <PaginationControls
        page={currentPage}
        pageSize={pageSize}
        totalItems={filteredPayments.length}
        itemLabel="payments"
        onPageChange={setCurrentPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setCurrentPage(1);
        }}
      />
    </div>
  );
}
