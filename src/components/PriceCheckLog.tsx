"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import type { PriceCheck } from "@/lib/types";

export default function PriceCheckLog() {
  const supabase = createClient();
  const [logs, setLogs] = useState<PriceCheck[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      let query = supabase
        .from("price_checks")
        .select("*, products(*)")
        .order("checked_at", { ascending: false })
        .limit(100);

      if (dateFilter) {
        const startOfDay = `${dateFilter}T00:00:00`;
        const endOfDay = `${dateFilter}T23:59:59`;
        query = query.gte("checked_at", startOfDay).lte("checked_at", endOfDay);
      }

      const { data } = await query;
      if (data) setLogs(data);
      setLoading(false);
    };
    fetchLogs();
  }, [supabase, dateFilter]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div>
      {/* Filter */}
      <div className="mb-6">
        <label className="mb-1 block text-sm font-medium text-gray-600">
          Filter by date
        </label>
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        />
        {dateFilter && (
          <button
            onClick={() => setDateFilter("")}
            className="ml-2 text-sm text-blue-600 hover:underline"
          >
            Clear
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <div className="h-6 w-6 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
        </div>
      ) : logs.length === 0 ? (
        <p className="py-10 text-center text-gray-400">No records found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500">
                <th className="pb-3 pr-4 font-medium">Name</th>
                <th className="pb-3 pr-4 font-medium">Email</th>
                <th className="pb-3 pr-4 font-medium">Model</th>
                <th className="pb-3 pr-4 font-medium">Storage</th>
                <th className="pb-3 pr-4 text-right font-medium">Qty</th>
                <th className="pb-3 pr-4 text-right font-medium">Total</th>
                <th className="pb-3 font-medium">Time</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr
                  key={log.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 pr-4 text-gray-700">
                    {log.user_name || "Guest"}
                  </td>
                  <td className="py-3 pr-4 text-gray-500">
                    {log.user_email || "-"}
                  </td>
                  <td className="py-3 pr-4 font-medium text-gray-800">
                    {log.products?.model || "-"}
                  </td>
                  <td className="py-3 pr-4 text-gray-600">
                    {log.products?.storage || "-"}
                  </td>
                  <td className="py-3 pr-4 text-right text-gray-700">
                    {log.quantity}
                  </td>
                  <td className="py-3 pr-4 text-right font-semibold text-green-700">
                    {log.total_price.toLocaleString()}
                  </td>
                  <td className="py-3 text-gray-500">
                    {formatDate(log.checked_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
