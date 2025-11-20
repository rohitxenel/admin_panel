"use client";

import { useState, useEffect } from "react";
import { RecentOrder } from "@/services/admincontrol";
import { FiActivity } from "react-icons/fi";

export default function DashboardPage() {
  const [orders, setOrders] = useState([]);
  const [orderLimit, setOrderLimit] = useState(10);
  const [loading, setLoading] = useState(false);

  // Fetch recent orders
  useEffect(() => {
    let abort = false;

    async function loadOrders() {
      try {
        setLoading(true);
        const res = await RecentOrder(orderLimit);
        if (!abort) {
          setOrders(res?.data?.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch recent orders:", error);
        if (!abort) setOrders([]);
      } finally {
        if (!abort) setLoading(false);
      }
    }

    loadOrders();
    return () => (abort = true);
  }, [orderLimit]);

  const fmtINR = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-8">

      {/* G&R Branded Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-800 via-sky-700 to-blue-800 text-white shadow-lg">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_#ffffff33_0,_transparent_50%)]" />
        <div className="relative px-6 py-6 md:px-10 md:py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-cyan-200">
              G&R Custom Elevator Cabs
            </p>
            <h1 className="text-2xl md:text-3xl font-bold mt-1">
              G&R Dashboard
            </h1>
            <p className="mt-2 text-sm md:text-base text-cyan-100 max-w-xl">
              View the most recent elevator cab orders and monitor activity in your G&R Control Hub.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end text-sm text-cyan-100">
              <span className="text-xs uppercase tracking-wide opacity-80">
                Recent Orders Loaded
              </span>
              <span className="text-lg font-semibold">
                {orders.length} record{orders.length === 1 ? "" : "s"}
              </span>
            </div>
            <div className="h-12 w-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
              <FiActivity className="h-6 w-6 text-cyan-100" />
            </div>
          </div>
        </div>
      </div>

      {/* Most Recent Orders */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Most Recent Orders</h2>
            <p className="text-sm text-slate-500">S.No · Customer · Driver · Status · Amount · Date</p>
          </div>

          {/* Limit dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Show</span>
            <select
              value={orderLimit}
              onChange={(e) => setOrderLimit(Number(e.target.value))}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            >
              {[10, 20, 30, 40, 50].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
            <span className="text-xs text-slate-500">rows</span>
          </div>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm text-center">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-slate-600 font-medium">S.No</th>
                <th className="px-4 py-3 text-slate-600 font-medium">Customer</th>
                <th className="px-4 py-3 text-slate-600 font-medium">Driver</th>
                <th className="px-4 py-3 text-slate-600 font-medium">Status</th>
                <th className="px-4 py-3 text-slate-600 font-medium">Amount</th>
                <th className="px-4 py-3 text-slate-600 font-medium">Date</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-6 text-slate-500">
                    Loading orders…
                  </td>
                </tr>
              ) : orders.length > 0 ? (
                orders.map((order, idx) => (
                  <tr key={order._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">{idx + 1}</td>
                    <td className="px-4 py-3">{order?.userId?.name || "N/A"}</td>
                    <td className="px-4 py-3">{order?.driverId?.name || "Unassigned"}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          order.status === "Completed"
                            ? "bg-emerald-50 text-emerald-700"
                            : order.status === "Cancelled"
                            ? "bg-rose-50 text-rose-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {fmtINR(
                        order?.fareDetails?.totalFare ||
                          order?.payment?.amount ||
                          0
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-6 text-slate-500">
                    No recent orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
