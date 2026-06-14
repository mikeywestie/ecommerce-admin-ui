import { useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Search } from "lucide-react";

import Button from "@/components/ui/Button";
import Notice from "@/components/ui/Notice";
import PageHeader from "@/components/ui/PageHeader";
import PaginationControls from "@/components/ui/PaginationControls";
import StatusBadge from "@/components/ui/StatusBadge";
import type { Order } from "../../types/Order";
import { getOrders } from "../../services/orderService";

type SortField = "id" | "customerName" | "customerEmail" | "totalAmount" | "status" | "createdAt";

type SortDirection = "asc" | "desc";

function getStatusTone(status: Order["status"]) {
  if (status === "PAID") return "green";
  if (status === "PENDING" || status === "CREATED") return "yellow";
  return "red";
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);

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
      setError("Failed to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleSort(field: SortField) {
    setCurrentPage(1);
    setExpandedOrderId(null);

    if (sortField === field) {
      setSortDirection((direction) => (direction === "asc" ? "desc" : "asc"));
      return;
    }

    setSortField(field);
    setSortDirection("asc");
  }

  const sortedOrders = useMemo(() => {
    const filteredOrders = orders.filter((order) => {
      const search = searchTerm.toLowerCase();

      return (
        order.customerName.toLowerCase().includes(search) ||
        order.customerEmail.toLowerCase().includes(search) ||
        order.status.toLowerCase().includes(search) ||
        order.id.toString().includes(search)
      );
    });

    return [...filteredOrders].sort((a, b) => {
      const firstValue = sortField === "createdAt" ? new Date(a.createdAt).getTime() : a[sortField];

      const secondValue =
        sortField === "createdAt" ? new Date(b.createdAt).getTime() : b[sortField];

      if (typeof firstValue === "number" && typeof secondValue === "number") {
        return sortDirection === "asc" ? firstValue - secondValue : secondValue - firstValue;
      }

      return sortDirection === "asc"
        ? String(firstValue).localeCompare(String(secondValue))
        : String(secondValue).localeCompare(String(firstValue));
    });
  }, [orders, searchTerm, sortDirection, sortField]);

  const paginatedOrders = sortedOrders.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  if (loading) {
    return (
      <div>
        <PageHeader title="Orders" description="Loading seeded order history..." />
        <div className="space-y-3">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-28 animate-pulse rounded-2xl border border-slate-800 bg-slate-800"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Orders"
        description="Review customer orders in a responsive card layout with no horizontal scrolling."
      />

      {error && (
        <div className="mb-5 space-y-3">
          <Notice tone="error">{error}</Notice>
          <Button onClick={loadOrders}>Retry</Button>
        </div>
      )}

      <div className="mb-5 grid gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 lg:grid-cols-[1fr_auto_auto]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => {
              setSearchTerm(event.target.value);
              setCurrentPage(1);
              setExpandedOrderId(null);
            }}
            placeholder="Search by customer, email, status or ID..."
            className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-10 pr-4 text-white outline-none focus:border-blue-500"
          />
        </div>

        <select
          value={sortField}
          onChange={(event) => handleSort(event.target.value as SortField)}
          className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
        >
          <option value="createdAt">Sort by Date</option>
          <option value="id">Sort by ID</option>
          <option value="customerName">Sort by Customer</option>
          <option value="customerEmail">Sort by Email</option>
          <option value="totalAmount">Sort by Amount</option>
          <option value="status">Sort by Status</option>
        </select>

        <Button
          variant="secondary"
          onClick={() => setSortDirection((direction) => (direction === "asc" ? "desc" : "asc"))}
        >
          {sortDirection === "asc" ? "Ascending" : "Descending"}
        </Button>
      </div>

      <div className="space-y-3">
        {paginatedOrders.map((order) => {
          const expanded = expandedOrderId === order.id;

          return (
            <article
              key={order.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/85 p-4 shadow-sm transition hover:border-slate-700"
            >
              <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr_0.9fr_0.7fr_auto] lg:items-center">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">Order</p>
                  <p className="text-xl font-bold text-white">#{order.id}</p>
                </div>

                <div className="min-w-0">
                  <p className="font-semibold text-white">{order.customerName}</p>
                  <p className="truncate text-sm text-slate-400">{order.customerEmail}</p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">Created</p>
                  <p className="font-semibold text-slate-200">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">Total</p>
                  <p className="font-bold text-blue-300">R {order.totalAmount.toFixed(2)}</p>
                </div>

                <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                  <StatusBadge tone={getStatusTone(order.status)}>{order.status}</StatusBadge>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      setExpandedOrderId((currentId) => (currentId === order.id ? null : order.id))
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
                </div>
              </div>

              {expanded && (
                <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-semibold text-white">Order Items</h3>
                    <span className="text-sm text-slate-400">
                      {order.items.length} item{order.items.length === 1 ? "" : "s"}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div
                        key={`${order.id}-${item.productId}`}
                        className="grid gap-2 rounded-xl border border-slate-800 bg-slate-900 p-3 sm:grid-cols-[1fr_auto_auto_auto] sm:items-center"
                      >
                        <p className="font-semibold text-white">{item.productName}</p>
                        <p className="text-sm text-slate-400">Qty {item.quantity}</p>
                        <p className="text-sm text-slate-400">R {item.unitPrice.toFixed(2)}</p>
                        <p className="font-bold text-blue-300">R {item.lineTotal.toFixed(2)}</p>
                      </div>
                    ))}

                    {order.items.length === 0 && (
                      <p className="rounded-xl border border-slate-800 p-4 text-center text-slate-400">
                        No items found for this order.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </article>
          );
        })}

        {paginatedOrders.length === 0 && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-400">
            No orders found.
          </div>
        )}
      </div>

      <PaginationControls
        page={currentPage}
        pageSize={pageSize}
        totalItems={sortedOrders.length}
        itemLabel="orders"
        onPageChange={(page) => {
          setCurrentPage(page);
          setExpandedOrderId(null);
        }}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setCurrentPage(1);
          setExpandedOrderId(null);
        }}
      />
    </div>
  );
}
