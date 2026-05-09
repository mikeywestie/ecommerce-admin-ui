import { useEffect, useState } from "react";

import type { Payment } from "../types/Payment";
import { getPayments } from "../services/paymentService";

export default function Payments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  function getStatusStyle(status: Payment["paymentStatus"]) {
    if (status === "SUCCESS") {
      return "bg-green-500/20 text-green-400";
    }

    if (status === "PENDING") {
      return "bg-yellow-500/20 text-yellow-400";
    }

    return "bg-red-500/20 text-red-400";
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Payments</h1>

        <div className="bg-red-500/20 border border-red-500 text-red-400 p-4 rounded-xl">
          {error}
        </div>

        <button
          onClick={loadPayments}
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
        <h1 className="text-3xl font-bold mb-6">Payments</h1>

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
      <h1 className="text-3xl font-bold mb-6">Payments</h1>

      <div className="bg-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-900">
            <tr>
              <th className="text-left p-4">Payment ID</th>
              <th className="text-left p-4">Order ID</th>
              <th className="text-left p-4">Method</th>
              <th className="text-left p-4">Amount</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Paid At</th>
            </tr>
          </thead>

          <tbody>
            {payments.map((payment) => (
              <tr
                key={payment.id}
                className="border-t border-slate-700 hover:bg-slate-700 transition"
              >
                <td className="p-4">{payment.id}</td>
                <td className="p-4">{payment.orderId}</td>
                <td className="p-4">{payment.paymentMethod}</td>
                <td className="p-4">R {payment.amount.toFixed(2)}</td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusStyle(
                      payment.paymentStatus
                    )}`}
                  >
                    {payment.paymentStatus}
                  </span>
                </td>

                <td className="p-4 text-slate-400">
                  {new Date(payment.paidAt).toLocaleString()}
                </td>
              </tr>
            ))}

            {payments.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-slate-400">
                  No payments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}