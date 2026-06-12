import { useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronUp, RefreshCcw } from "lucide-react";

import Button from "@/components/ui/Button";
import Notice from "@/components/ui/Notice";
import PaginationControls from "@/components/ui/PaginationControls";
import StatusBadge from "@/components/ui/StatusBadge";
import type { Order } from "@/types/Order";
import { cancelPaidOrder, getOrders } from "@/services/orderService";

function getStatusTone(status: Order["status"]) {
  if (status === "PAID") return "green";
  if (status === "PENDING" || status === "CREATED") return "yellow";
  return "red";
}

export default function CustomerOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingOrderId, setCancellingOrderId] = useState<number | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const email = localStorage.getItem("email");

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    try {
      setLoading(true);
      setError("");

      const data = await getOrders();
      setOrders(data);
    } catch {
      setError("Unable to load order history.");
    } finally {
      setLoading(false);
    }
  }

  async function cancelOrder(orderId: number) {
    const confirmed = window.confirm(
      "Cancel this paid order and simulate a refund? This requires the backend refund endpoint."
    );

    if (!confirmed) return;

    try {
      setCancellingOrderId(orderId);
      setError("");
      setSuccess("");

      await cancelPaidOrder(orderId);
      setSuccess("Order cancellation/refund simulation completed.");
      await loadOrders();
    } catch {
      setError(
        "Unable to cancel this order. The frontend is ready, but the backend /api/orders/{id}/cancel-refund endpoint may still need to be added."
      );
    } finally {
      setCancellingOrderId(null);
    }
  }

  const visibleOrders = useMemo(() => {
    return [...orders]
      .filter((order) => !email || order.customerEmail === email)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }, [email, orders]);

  const paginatedOrders = visibleOrders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-500">
        Loading order history...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">Order History</h1>
        <p className="mt-2 text-slate-500">
          Open an order to review the items. Paid orders can be cancelled once
          the backend refund simulation endpoint is available.
        </p>
      </div>

      {error && <Notice tone="error">{error}</Notice>}
      {success && <Notice tone="success">{success}</Notice>}

      <div className="space-y-3">
        {paginatedOrders.map((order) => {
          const expanded = expandedOrderId === order.id;

          return (
            <article
              key={order.id}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="grid gap-4 lg:grid-cols-[0.7fr_1fr_0.8fr_auto] lg:items-center">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    Order
                  </p>
                  <p className="text-xl font-bold text-slate-900">#{order.id}</p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    Date
                  </p>
                  <p className="font-semibold text-slate-700">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    Total
                  </p>
                  <p className="font-bold text-blue-600">
                    R {order.totalAmount.toFixed(2)}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                  <StatusBadge tone={getStatusTone(order.status)}>
                    {order.status}
                  </StatusBadge>

                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() =>
                      setExpandedOrderId((currentId) =>
                        currentId === order.id ? null : order.id
                      )
                    }
                    icon={
                      expanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )
                    }
                  >
                    {expanded ? "Hide" : "Open"}
                  </Button>

                  {order.status === "PAID" && (
                    <Button
                      size="sm"
                      variant="dangerGhost"
                      onClick={() => cancelOrder(order.id)}
                      disabled={cancellingOrderId === order.id}
                      icon={<RefreshCcw className="h-4 w-4" />}
                    >
                      {cancellingOrderId === order.id
                        ? "Cancelling..."
                        : "Cancel / Refund"}
                    </Button>
                  )}
                </div>
              </div>

              {expanded && (
                <div className="mt-4 space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  {order.items.map((item) => (
                    <div
                      key={`${order.id}-${item.productId}`}
                      className="grid gap-2 rounded-xl bg-white p-3 sm:grid-cols-[1fr_auto_auto_auto] sm:items-center"
                    >
                      <p className="font-semibold text-slate-900">
                        {item.productName}
                      </p>
                      <p className="text-sm text-slate-500">Qty {item.quantity}</p>
                      <p className="text-sm text-slate-500">
                        R {item.unitPrice.toFixed(2)}
                      </p>
                      <p className="font-bold text-blue-600">
                        R {item.lineTotal.toFixed(2)}
                      </p>
                    </div>
                  ))}

                  {order.items.length === 0 && (
                    <p className="text-center text-slate-500">
                      No items found for this order.
                    </p>
                  )}
                </div>
              )}
            </article>
          );
        })}

        {paginatedOrders.length === 0 && (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-500">
            No orders found for this account yet.
          </div>
        )}
      </div>

      <PaginationControls
        page={currentPage}
        pageSize={pageSize}
        totalItems={visibleOrders.length}
        itemLabel="orders"
        onPageChange={setCurrentPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setCurrentPage(1);
        }}
      />
    </div>
  );
}
