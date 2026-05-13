import { Fragment, useEffect, useState } from "react";

import type { Order } from "../types/Order";
import { getOrders } from "../../services/orderService";

type SortField =
  | "id"
  | "customerName"
  | "customerEmail"
  | "totalAmount"
  | "status"
  | "createdAt";

type SortDirection = "asc" | "desc";

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);

  const pageSize = 5;

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

  function getStatusStyle(status: Order["status"]) {
    if (status === "PAID") {
      return "bg-green-500/20 text-green-400";
    }

    if (status === "PENDING" || status === "CREATED") {
      return "bg-yellow-500/20 text-yellow-400";
    }

    return "bg-red-500/20 text-red-400";
  }

  function handleSort(field: SortField) {
    setCurrentPage(1);

    if (sortField === field) {
      setSortDirection((direction) => (direction === "asc" ? "desc" : "asc"));
      return;
    }

    setSortField(field);
    setSortDirection("asc");
  }

  function getSortIcon(field: SortField) {
    if (sortField !== field) {
      return "↕";
    }

    return sortDirection === "asc" ? "↑" : "↓";
  }

  function toggleOrderItems(orderId: number) {
    setExpandedOrderId((currentId) => (currentId === orderId ? null : orderId));
  }

  const filteredOrders = orders.filter((order) => {
    const search = searchTerm.toLowerCase();

    return (
      order.customerName.toLowerCase().includes(search) ||
      order.customerEmail.toLowerCase().includes(search) ||
      order.status.toLowerCase().includes(search) ||
      order.id.toString().includes(search)
    );
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    let firstValue: string | number = "";
    let secondValue: string | number = "";

    if (sortField === "createdAt") {
      firstValue = new Date(a.createdAt).getTime();
      secondValue = new Date(b.createdAt).getTime();
    } else {
      firstValue = a[sortField];
      secondValue = b[sortField];
    }

    if (typeof firstValue === "number" && typeof secondValue === "number") {
      return sortDirection === "asc"
        ? firstValue - secondValue
        : secondValue - firstValue;
    }

    return sortDirection === "asc"
      ? String(firstValue).localeCompare(String(secondValue))
      : String(secondValue).localeCompare(String(firstValue));
  });

  const totalPages = Math.ceil(sortedOrders.length / pageSize);

  const paginatedOrders = sortedOrders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Orders</h1>

        <div className="bg-red-500/20 border border-red-500 text-red-400 p-4 rounded-xl">
          {error}
        </div>

        <button
          onClick={loadOrders}
          className="mt-4 bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-xl"
        >
          Retry
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Orders</h1>

        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-16 bg-slate-800 rounded-xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">Orders</h1>

        <input
          type="text"
          value={searchTerm}
          onChange={(event) => {
            setSearchTerm(event.target.value);
            setCurrentPage(1);
            setExpandedOrderId(null);
          }}
          placeholder="Search by customer, email, status or ID..."
          className="w-full md:w-96 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500"
        />
      </div>

      <div className="bg-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-900">
            <tr>
              <th
                onClick={() => handleSort("id")}
                className="text-left p-4 cursor-pointer select-none"
              >
                Order ID {getSortIcon("id")}
              </th>
              <th
                onClick={() => handleSort("customerName")}
                className="text-left p-4 cursor-pointer select-none"
              >
                Customer {getSortIcon("customerName")}
              </th>
              <th
                onClick={() => handleSort("customerEmail")}
                className="text-left p-4 cursor-pointer select-none"
              >
                Email {getSortIcon("customerEmail")}
              </th>
              <th
                onClick={() => handleSort("totalAmount")}
                className="text-left p-4 cursor-pointer select-none"
              >
                Amount {getSortIcon("totalAmount")}
              </th>
              <th
                onClick={() => handleSort("status")}
                className="text-left p-4 cursor-pointer select-none"
              >
                Status {getSortIcon("status")}
              </th>
              <th
                onClick={() => handleSort("createdAt")}
                className="text-left p-4 cursor-pointer select-none"
              >
                Created {getSortIcon("createdAt")}
              </th>
            </tr>
          </thead>

          <tbody>
            {paginatedOrders.map((order) => (
              <Fragment key={order.id}>
                <tr className="border-t border-slate-700 hover:bg-slate-700 transition">
                  <td className="p-4">
                    <button
                      onClick={() => toggleOrderItems(order.id)}
                      className="mr-3 inline-flex h-7 w-7 items-center justify-center rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white"
                    >
                      {expandedOrderId === order.id ? "−" : "+"}
                    </button>

                    {order.id}
                  </td>

                  <td className="p-4">{order.customerName}</td>
                  <td className="p-4 text-slate-400">{order.customerEmail}</td>
                  <td className="p-4">R {order.totalAmount.toFixed(2)}</td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusStyle(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>

                  <td className="p-4 text-slate-400">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>

                {expandedOrderId === order.id && (
                  <tr className="bg-slate-900/60">
                    <td colSpan={6} className="p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <h3 className="font-semibold text-white">
                          Order Items
                        </h3>

                        <span className="text-sm text-slate-400">
                          {order.items.length} item
                          {order.items.length === 1 ? "" : "s"}
                        </span>
                      </div>

                      <div className="rounded-xl border border-slate-700 overflow-hidden">
                        <table className="w-full text-sm">
                          <thead className="bg-slate-950">
                            <tr>
                              <th className="text-left p-3">Product</th>
                              <th className="text-left p-3">Quantity</th>
                              <th className="text-left p-3">Unit Price</th>
                              <th className="text-left p-3">Line Total</th>
                            </tr>
                          </thead>

                          <tbody>
                            {order.items.map((item) => (
                              <tr
                                key={`${order.id}-${item.productId}`}
                                className="border-t border-slate-700"
                              >
                                <td className="p-3">{item.productName}</td>
                                <td className="p-3">{item.quantity}</td>
                                <td className="p-3">
                                  R {item.unitPrice.toFixed(2)}
                                </td>
                                <td className="p-3">
                                  R {item.lineTotal.toFixed(2)}
                                </td>
                              </tr>
                            ))}

                            {order.items.length === 0 && (
                              <tr>
                                <td
                                  colSpan={4}
                                  className="p-4 text-center text-slate-400"
                                >
                                  No items found for this order.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}

            {paginatedOrders.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-slate-400">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4 text-sm text-slate-400">
        <p>
          Showing {paginatedOrders.length} of {sortedOrders.length} orders
        </p>

        <div className="flex items-center gap-3">
          <span>
            Page {currentPage} of {totalPages || 1}
          </span>

          <button
            disabled={currentPage === 1}
            onClick={() => {
              setCurrentPage((page) => page - 1);
              setExpandedOrderId(null);
            }}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800"
          >
            Previous
          </button>

          <button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => {
              setCurrentPage((page) => page + 1);
              setExpandedOrderId(null);
            }}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}