"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface LogEntry {
  id: string;
  action: string;
  details: Record<string, unknown>;
  created_at: string;
  staff: { id: string; nickname: string; company: string } | null;
}

const ACTION_LABELS: Record<string, { label: string; icon: string }> = {
  login: { label: "เข้าสู่ระบบ", icon: "🔑" },
  view_product: { label: "ดูสินค้า", icon: "👀" },
  add_to_cart: { label: "เพิ่มตะกร้า", icon: "🛒" },
  export_quote: { label: "ส่งออกใบสรุป", icon: "📤" },
};

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/logs?limit=100")
      .then((res) => res.json())
      .then((data) => {
        if (data.logs) setLogs(data.logs);
      })
      .finally(() => setLoading(false));
  }, []);

  function formatTime(dateStr: string) {
    const d = new Date(dateStr);
    return d.toLocaleString("th-TH", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (loading) {
    return (
      <div className="p-4 space-y-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="skeleton h-14 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="p-4 max-w-lg mx-auto pb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-brand-navy">Activity Logs</h2>
        <Link
          href="/admin"
          className="text-sm text-brand-navy hover:underline"
        >
          กลับ
        </Link>
      </div>

      {logs.length === 0 ? (
        <div className="text-center text-gray-400 py-12">
          ยังไม่มีข้อมูล
        </div>
      ) : (
        <div className="space-y-1">
          {logs.map((log) => {
            const actionInfo =
              ACTION_LABELS[log.action] || { label: log.action, icon: "📋" };
            return (
              <div
                key={log.id}
                className="bg-white rounded-xl px-4 py-3 border border-gray-100 flex items-center gap-3"
              >
                <span className="text-lg">{actionInfo.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-brand-navy truncate">
                    {log.staff?.nickname || "Unknown"}{" "}
                    <span className="font-normal text-gray-500">
                      {actionInfo.label}
                    </span>
                  </p>
                  {Object.keys(log.details).length > 0 && (
                    <p className="text-xs text-gray-400 truncate">
                      {JSON.stringify(log.details)}
                    </p>
                  )}
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap">
                  {formatTime(log.created_at)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
