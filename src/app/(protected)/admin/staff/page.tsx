"use client";

import { useState, useEffect, useCallback } from "react";
import type { Staff } from "@/lib/types";
import Link from "next/link";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: "รออนุมัติ", color: "bg-yellow-100 text-yellow-800" },
  active: { label: "ใช้งาน", color: "bg-green-100 text-green-800" },
  inactive: { label: "ปิดใช้งาน", color: "bg-gray-100 text-gray-600" },
};

export default function StaffManagementPage() {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchStaff = useCallback(() => {
    fetch("/api/staff")
      .then((res) => res.json())
      .then((data) => {
        if (data.staff) setStaffList(data.staff);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  async function updateStaff(
    id: string,
    updates: { status?: string; role?: string }
  ) {
    setUpdating(id);
    try {
      const res = await fetch(`/api/staff/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        fetchStaff();
      }
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
    <div className="p-4 max-w-lg mx-auto space-y-3 pb-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-brand-navy">จัดการพนักงาน</h2>
        <Link
          href="/admin"
          className="text-sm text-brand-navy hover:underline"
        >
          กลับ
        </Link>
      </div>

      {sortedStaff.length === 0 ? (
        <div className="text-center text-gray-400 py-12">
          ยังไม่มีพนักงาน
        </div>
      ) : (
        sortedStaff.map((s) => {
          const statusInfo = STATUS_LABELS[s.status] || STATUS_LABELS.pending;
          const isUpdating = updating === s.id;
          const companyLabel =
            s.company === "vnphone" ? "VN Phone" : "สยามชัย";

          return (
            <div
              key={s.id}
              className={`bg-white rounded-xl border p-4 transition ${
                s.status === "pending"
                  ? "border-yellow-300 bg-yellow-50/50"
                  : "border-gray-200"
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
                <div className="flex gap-1.5">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusInfo.color}`}
                  >
                    {statusInfo.label}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-blue-100 text-blue-800">
                    {companyLabel}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-3">
                {s.status === "pending" && (
                  <button
                    onClick={() => updateStaff(s.id, { status: "active" })}
                    disabled={isUpdating}
                    className="text-xs bg-green-500 text-white px-3 py-1.5 rounded-lg hover:bg-green-600 transition disabled:opacity-50"
                  >
                    อนุมัติ
                  </button>
                )}
                {s.status === "active" && (
                  <button
                    onClick={() => updateStaff(s.id, { status: "inactive" })}
                    disabled={isUpdating}
                    className="text-xs bg-gray-500 text-white px-3 py-1.5 rounded-lg hover:bg-gray-600 transition disabled:opacity-50"
                  >
                    ปิดใช้งาน
                  </button>
                )}
                {s.status === "inactive" && (
                  <button
                    onClick={() => updateStaff(s.id, { status: "active" })}
                    disabled={isUpdating}
                    className="text-xs bg-green-500 text-white px-3 py-1.5 rounded-lg hover:bg-green-600 transition disabled:opacity-50"
                  >
                    เปิดใช้งาน
                  </button>
                )}
                {s.role === "staff" && s.status === "active" && (
                  <button
                    onClick={() => updateStaff(s.id, { role: "admin" })}
                    disabled={isUpdating}
                    className="text-xs bg-brand-navy text-white px-3 py-1.5 rounded-lg hover:bg-brand-navy-light transition disabled:opacity-50"
                  >
                    เลื่อนเป็น Admin
                  </button>
                )}
                {s.role === "admin" && s.status === "active" && (
                  <button
                    onClick={() => updateStaff(s.id, { role: "staff" })}
                    disabled={isUpdating}
                    className="text-xs bg-orange-500 text-white px-3 py-1.5 rounded-lg hover:bg-orange-600 transition disabled:opacity-50"
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
