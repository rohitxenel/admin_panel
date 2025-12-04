"use client";

import { useState, useEffect } from "react";
import { dashboard } from "@/services/admincontrol"; 
import { Download } from "lucide-react";



export default function GRDashboard() {
  const [records, setRecords] = useState([]);
  const [recordLimit, setRecordLimit] = useState(10);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let stop = false;

    async function loadDashboard() {
      try {
        setLoading(true);

        const res = await dashboard(); 

        if (!stop) {
          setRecords(res?.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard:", error);
        if (!stop) setRecords([]);
      } finally {
        if (!stop) setLoading(false);
      }
    }

    loadDashboard();
    return () => (stop = true);
  }, [recordLimit]); 

  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-8">

      {/* HEADER */}
      <div className="rounded-2xl p-6 bg-gradient-to-r from-cyan-800 to-blue-700 text-white shadow-lg">
        <h1 className="text-3xl font-bold">G&R Dashboard</h1>
        <p className="mt-2 text-cyan-100">
          Admin view of all elevator cab submissions.
        </p>
      </div>

      {/* TABLE CARD */}
      <div className="bg-white rounded-2xl shadow border">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-slate-900">All Forms Data</h2>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Show</span>
            <select
              value={recordLimit}
              onChange={(e) => setRecordLimit(Number(e.target.value))}
              className="px-3 py-2 border rounded-lg text-sm"
            >
              {[10, 20, 30, 40, 50].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
            <span className="text-xs text-slate-500">rows</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-center divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3">S.No</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Customer ID</th>
                <th className="px-4 py-3">Company</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Project</th>
                <th className="px-4 py-3">Cab</th>
                <th className="px-4 py-3">Address</th>
                <th className="px-4 py-3">Zip</th>
                <th className="px-4 py-3">Ship Contact</th>
                <th className="px-4 py-3">Shiping Zip</th>
                <th className="px-4 py-3">Dimensions</th>
                <th className="px-4 py-3">File</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="15" className="py-6">Loading…</td>
                </tr>
              ) : records.length ? (
                records.slice(0, recordLimit).map((item, idx) => (
                  <tr key={item._id}>
                    <td className="px-4 py-3">{idx + 1}</td>
                    <td className="px-4 py-3">{item.name}</td>
                    <td className="px-4 py-3">{item.customerId}</td>
                    <td className="px-4 py-3">{item.companyName}</td>
                    <td className="px-4 py-3">{item.contactName}</td>
                    <td className="px-4 py-3">{item.phone}</td>
                    <td className="px-4 py-3">{item.projectName}</td>
                    <td className="px-4 py-3">{item.CabName}</td>
                    <td className="px-4 py-3">{item.projectAddress}</td>
                    <td className="px-4 py-3">{item.zipcode}</td>
                    <td className="px-4 py-3">{item.shippingContact}</td>
                    <td className="px-4 py-3">{item.shippingZipcode}</td>

                    <td className="px-4 py-3">
                      {Array.isArray(item.dimensions)
                        ? item.dimensions.join(" | ")
                        : item.dimensions}
                    </td>
                   
                    {/* <td className="px-4 py-3 break-all">{item.file}</td> */}

                    <td className="px-4 py-3">
  {item.file ? (
    <a
      href={item.file}
      download
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center p-2 bg-cyan-100 hover:bg-cyan-200 text-cyan-700 rounded-full transition-all"
      title="Download attached file"
    >
      <Download size={18} />
    </a>
  ) : (
    <span className="text-gray-400">-</span>
  )}
</td>


                    <td className="px-4 py-3">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="15" className="py-6">No data found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
