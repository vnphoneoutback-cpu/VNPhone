"use client";

import { useState, useEffect, useCallback } from "react";
import type { Staff } from "@/lib/types";
import Link from "next/link";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: "รออนุมัติ", color: "bg-yellow-100 text-yellow-800" },
  active: { label: "ใช้งาน", color: "bg-green-100 text-green-800" },
  inactive: { label: "ปิดใช้งาน", color: "bg-gray-100 text-gray-600" },
};

const ROLE_LABELS: Record<string, { label: string; color: string }> = {
  admin: { label: "Admin", color: "bg-violet-100 text-violet-700" },
  staff: { label: "Member", color: "bg-slate-100 text-slate-700" },
};

export default function StaffManagementPage() {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [error, setError] = useState("");

  const fetchStaff = useCallback(async () => {
    setError("");
    try {
      const res = await fetch("/api/staff");
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "โหลดรายชื่อสมาชิกไม่สำเร็จ");
      }
      setStaffList(data.staff || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : "เกิดข้อผิดพลาด";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchStaff();
  }, [fetchStaff]);

  async function updateStaff(
    id: string,
    updates: { status?: string; role?: string }
  ) {
    setUpdating(id);
    setError("");
    try {
      const res = await fetch(`/api/staff/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "อัปเดตสมาชิกไม่สำเร็จ");
      }
      await fetchStaff();
    } catch (err) {
      const message = err instanceof Error ? err.message : "เกิดข้อผิดพลาด";
      setError(message);
    } finally {
      setUpdating(null);
    }
  }

  if (loading) {
    return (
      <div className="p-4 space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton h-24 rounded-xl" />
        ))}
      </div>
    );
  }

  // Sort: pending first, then active, then inactive
  const sortedStaff = [...staffList].sort((a, b) => {
    const order = { pending: 0, active: 1, inactive: 2 };
    return (
      (order[a.status as keyof typeof order] ?? 3) -
      (order[b.status as keyof typeof order] ?? 3)
    );
  });

  return (
    <div className="mx-auto max-w-4xl space-y-3 pb-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold text-brand-navy">จัดการสมาชิก</h2>
        <Link
          href="/admin"
          className="rounded-lg border border-brand-navy/20 bg-white/70 px-3 py-1.5 text-sm font-semibold text-brand-navy transition hover:bg-white"
        >
          กลับ
        </Link>
      </div>

      {error && (
        <div className="glass-card rounded-xl border border-red-200 bg-red-50/80 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {sortedStaff.length === 0 ? (
        <div className="glass-card rounded-2xl py-12 text-center text-gray-400">
          ยังไม่มีพนักงาน
        </div>
      ) : (
        sortedStaff.map((s) => {
          const statusInfo = STATUS_LABELS[s.status] || STATUS_LABELS.pending;
          const roleInfo = ROLE_LABELS[s.role] || ROLE_LABELS.staff;
          const isUpdating = updating === s.id;
          const companyLabel =
            s.company === "vnphone" ? "VN Phone" : "สยามชัย";

          return (
            <div
              key={s.id}
              className={`glass-card rounded-2xl border p-4 transition ${
                s.status === "pending"
                  ? "border-yellow-300 bg-yellow-50/40"
                  : "border-white/60"
              } ${isUpdating ? "opacity-50" : ""}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-bold text-brand-navy">
                    {s.nickname}{" "}
                    <span className="text-xs font-normal text-gray-400">
                      ({s.first_name} {s.last_name})
                    </span>
                  </p>
                  <p className="text-xs text-gray-500">
                    {s.email} · {s.phone}
                  </p>
                </div>
                <div className="flex flex-wrap justify-end gap-1.5">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusInfo.color}`}
                  >
                    {statusInfo.label}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleInfo.color}`}
                  >
                    {roleInfo.label}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-blue-100 text-blue-800">
                    {companyLabel}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-3 flex flex-wrap gap-2">
                {s.status === "pending" && (
                  <button
                    onClick={() => updateStaff(s.id, { status: "active" })}
                    disabled={isUpdating}
                    className="rounded-lg bg-green-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-green-600 disabled:opacity-50"
                  >
                    อนุมัติ
                  </button>
                )}
                {s.status === "active" && (
                  <button
                    onClick={() => updateStaff(s.id, { status: "inactive" })}
                    disabled={isUpdating}
                    className="rounded-lg bg-gray-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-gray-600 disabled:opacity-50"
                  >
                    ปิดใช้งาน
                  </button>
                )}
                {s.status === "inactive" && (
                  <button
                    onClick={() => updateStaff(s.id, { status: "active" })}
                    disabled={isUpdating}
                    className="rounded-lg bg-green-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-green-600 disabled:opacity-50"
                  >
                    เปิดใช้งาน
                  </button>
                )}
                {s.role === "staff" && s.status === "active" && (
                  <button
                    onClick={() => updateStaff(s.id, { role: "admin" })}
                    disabled={isUpdating}
                    className="rounded-lg bg-brand-navy px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-brand-navy-light disabled:opacity-50"
                  >
                    เลื่อนเป็น Admin
                  </button>
                )}
                {s.role === "admin" && s.status === "active" && (
                  <button
                    onClick={() => updateStaff(s.id, { role: "staff" })}
                    disabled={isUpdating}
                    className="rounded-lg bg-orange-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-orange-600 disabled:opacity-50"
                  >
                    ลดเป็น Staff
                  </button>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
