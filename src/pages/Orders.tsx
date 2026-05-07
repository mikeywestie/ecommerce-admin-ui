import { useEffect, useState } from "react";

import type { Order } from "../types/Order";
import { getOrders } from "../services/orderService";

export default function Orders() {

  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    const data = await getOrders();
    setOrders(data);
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        Orders
      </h1>

      <div className="bg-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-900">
            <tr>
              <th className="text-left p-4">Order ID</th>
              <th className="text-left p-4">Customer</th>
              <th className="text-left p-4">Amount</th>
              <th className="text-left p-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-t border-slate-700 hover:bg-slate-700 transition"
              >
                <td className="p-4">{order.id}</td>
                <td className="p-4">{order.customer}</td>
                <td className="p-4">{order.amount}</td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold
                    ${
                      order.status === "PAID"
                        ? "bg-green-500/20 text-green-400"
                        : order.status === "PENDING"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}