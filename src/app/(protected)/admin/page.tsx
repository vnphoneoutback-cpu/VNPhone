import { getCurrentStaff } from "@/lib/auth";
import { createServerClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminPage() {
  const staff = await getCurrentStaff();
  if (!staff || staff.role !== "admin") redirect("/dashboard");

  const supabase = createServerClient();

  const { count: pendingCount } = await supabase
    .from("staff")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending");

  const { count: activeCount } = await supabase
    .from("staff")
    .select("*", { count: "exact", head: true })
    .eq("status", "active");

  const { count: totalStaff } = await supabase
    .from("staff")
    .select("*", { count: "exact", head: true });

  return (
    <div className="p-4 max-w-lg mx-auto space-y-4">
      <h2 className="text-xl font-bold text-brand-navy">Admin Dashboard</h2>

      {/* Stats cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
          <p className="text-3xl font-bold text-brand-navy">
            {pendingCount ?? 0}
          </p>
          <p className="text-xs text-gray-500 mt-1">รออนุมัติ</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
          <p className="text-3xl font-bold text-green-600">
            {activeCount ?? 0}
          </p>
          <p className="text-xs text-gray-500 mt-1">ใช้งาน</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
          <p className="text-3xl font-bold text-gray-600">
            {totalStaff ?? 0}
          </p>
          <p className="text-xs text-gray-500 mt-1">ทั้งหมด</p>
        </div>
      </div>

      {/* Quick links */}
      <div className="space-y-2">
        <Link
          href="/admin/staff"
          className="block bg-white rounded-xl p-4 border border-gray-200 hover:border-brand-navy/30 transition"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-brand-navy">จัดการพนักงาน</h3>
              <p className="text-sm text-gray-500">
                อนุมัติ / ปิดการใช้งาน / เปลี่ยน role
              </p>
            </div>
            {(pendingCount ?? 0) > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                {pendingCount}
              </span>
            )}
          </div>
        </Link>

        <Link
          href="/admin/logs"
          className="block bg-white rounded-xl p-4 border border-gray-200 hover:border-brand-navy/30 transition"
        >
          <h3 className="font-bold text-brand-navy">Activity Logs</h3>
          <p className="text-sm text-gray-500">
            ดูประวัติการใช้งานระบบ
          </p>
        </Link>

        <Link
          href="/dashboard"
          className="block bg-brand-navy text-white rounded-xl p-4 text-center font-medium hover:bg-brand-navy-light transition"
        >
          กลับหน้า Dashboard
        </Link>
      </div>
    </div>
  );
}
