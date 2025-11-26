"use client";

import { useState, useEffect } from "react";
import { FiFileText, FiClock, FiCheckCircle, FiXCircle, FiSearch } from "react-icons/fi";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // Fake sample data (replace with your API later)
  useEffect(() => {
    const sampleOrders = [
      {
        id: "ORD-001",
        customer: "John Doe",
        status: "Completed",
        amount: 1500,
        date: "2024-02-01",
      },
      {
        id: "ORD-002",
        customer: "Dustin Lee",
        status: "Cancelled",
        amount: 800,
        date: "2024-02-03",
      },
      {
        id: "ORD-003",
        customer: "Emily Clark",
        status: "Pending",
        amount: 1200,
        date: "2024-02-05",
      },
    ];

    setOrders(sampleOrders);
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-100 text-emerald-700";
      case "Cancelled":
        return "bg-rose-100 text-rose-700";
      default:
        return "bg-amber-100 text-amber-700";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-8">
      {/* HEADER */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-800 via-sky-700 to-blue-800 text-white shadow-lg">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_#ffffff33_0,_transparent_50%)]" />
        <div className="relative px-6 py-8 md:px-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-cyan-200">
              G&R Custom Elevator Cabs
            </p>
            <h1 className="text-3xl font-bold mt-1">Orders Management</h1>
            <p className="mt-2 text-sm md:text-base text-cyan-100 max-w-xl">
              View and manage all elevator cab orders in your G&R Control Hub.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
              <FiFileText className="h-6 w-6 text-cyan-100" />
            </div>
          </div>
        </div>
      </div>

      {/* TABLE CARD */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        {/* Search Row */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-900">All Orders</h2>

          <div className="relative w-64">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm text-center">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-slate-600 font-medium">Order ID</th>
                <th className="px-4 py-3 text-slate-600 font-medium">Customer</th>
                <th className="px-4 py-3 text-slate-600 font-medium">Status</th>
                <th className="px-4 py-3 text-slate-600 font-medium">Amount</th>
                <th className="px-4 py-3 text-slate-600 font-medium">Date</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-3 font-medium text-slate-800">{order.id}</td>
                    <td className="px-4 py-3">{order.customer}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">₹{order.amount.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      {new Date(order.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-6 text-slate-500">
                    No orders available.
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
