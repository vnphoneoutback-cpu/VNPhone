"use client";

import { useState, useEffect, useMemo } from "react";
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
  view_dashboard: { label: "เข้าใช้งาน dashboard", icon: "🧭" },
  view_product: { label: "ดูสินค้า", icon: "👀" },
  add_to_cart: { label: "เพิ่มตะกร้า", icon: "🛒" },
  open_quote: { label: "เปิดใบสรุปราคา", icon: "🧾" },
  export_quote: { label: "ส่งออกใบสรุป", icon: "📤" },
  admin_update_staff: { label: "อัปเดตสมาชิก", icon: "🛠️" },
};

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionFilter, setActionFilter] = useState("all");

  useEffect(() => {
    fetch("/api/logs?limit=120")
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "โหลด logs ไม่สำเร็จ");
        setLogs(data.logs || []);
      })
      .catch((err) => {
        const message = err instanceof Error ? err.message : "เกิดข้อผิดพลาด";
        setError(message);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredLogs = useMemo(() => {
    if (actionFilter === "all") return logs;
    return logs.filter((log) => log.action === actionFilter);
  }, [logs, actionFilter]);

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
      <div className="space-y-2 p-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="skeleton h-14 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-3 pb-8">
      <div className="mb-1 flex items-center justify-between">
        <h2 className="text-xl font-extrabold text-brand-navy">Activity Logs</h2>
        <Link
          href="/admin"
          className="rounded-lg border border-brand-navy/20 bg-white/70 px-3 py-1.5 text-sm font-semibold text-brand-navy transition hover:bg-white"
        >
          กลับ
        </Link>
      </div>

      <div className="glass-card rounded-2xl p-3">
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-brand-navy/60">
          กรองตามกิจกรรม
        </label>
        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="lux-input w-full rounded-xl px-3 py-2 text-sm text-brand-navy outline-none"
        >
          <option value="all">ทั้งหมด</option>
          {Object.entries(ACTION_LABELS).map(([action, info]) => (
            <option key={action} value={action}>
              {info.label}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="glass-card rounded-xl border border-red-200 bg-red-50/80 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {filteredLogs.length === 0 ? (
        <div className="glass-card rounded-2xl py-12 text-center text-gray-400">
          ยังไม่มีข้อมูล
        </div>
      ) : (
        <div className="space-y-2">
          {filteredLogs.map((log) => {
            const actionInfo =
              ACTION_LABELS[log.action] || { label: log.action, icon: "📋" };
            return (
              <div
                key={log.id}
                className="glass-card flex items-center gap-3 rounded-xl px-4 py-3"
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
                <span className="whitespace-nowrap text-xs text-gray-400">
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
