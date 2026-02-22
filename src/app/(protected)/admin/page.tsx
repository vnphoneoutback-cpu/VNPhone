import { getCurrentStaff } from "@/lib/auth";
import { createServerClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import Link from "next/link";

const DEFAULT_SHEET_URL =
  "https://docs.google.com/spreadsheets/d/11L9dcItuikvOHNHivtFI9Y0_mVtDXtP8CsIzoiClPgM/edit?usp=sharing";

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

  const sheetUrl = process.env.GOOGLE_SHEET_EDIT_URL
    || (process.env.GOOGLE_SHEET_ID
      ? `https://docs.google.com/spreadsheets/d/${process.env.GOOGLE_SHEET_ID}/edit?usp=sharing`
      : DEFAULT_SHEET_URL);

  return (
    <div className="mx-auto max-w-4xl space-y-4 px-2 sm:px-0">
      <section className="glass-card rounded-3xl p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-navy/55">
              VN Phone Admin
            </p>
            <h2 className="mt-1 text-2xl font-extrabold text-brand-navy">
              Admin Dashboard
            </h2>
            <p className="mt-1 text-sm text-brand-navy/65">
              จัดการสมาชิก อัปเดตราคา และตรวจสอบประวัติการใช้งาน
            </p>
          </div>
          <a
            href={sheetUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-xl bg-brand-navy px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-navy-light"
          >
            เปิด Google Sheet ราคา
          </a>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="glass-card rounded-2xl p-4 text-center">
          <p className="text-3xl font-extrabold text-brand-navy">
            {pendingCount ?? 0}
          </p>
          <p className="mt-1 text-xs text-brand-navy/60">รออนุมัติ</p>
        </div>
        <div className="glass-card rounded-2xl p-4 text-center">
          <p className="text-3xl font-extrabold text-emerald-600">
            {activeCount ?? 0}
          </p>
          <p className="mt-1 text-xs text-brand-navy/60">ใช้งาน</p>
        </div>
        <div className="glass-card rounded-2xl p-4 text-center">
          <p className="text-3xl font-extrabold text-brand-navy/80">
            {totalStaff ?? 0}
          </p>
          <p className="mt-1 text-xs text-brand-navy/60">ทั้งหมด</p>
        </div>
      </div>

      <div className="space-y-3">
        <Link
          href="/admin/staff"
          className="glass-card block rounded-2xl p-4 transition hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-brand-navy">จัดการสมาชิก</h3>
              <p className="text-sm text-brand-navy/60">
                อนุมัติ / ปิดการใช้งาน / เปลี่ยน role
              </p>
            </div>
            {(pendingCount ?? 0) > 0 && (
              <span className="rounded-full bg-red-500 px-2.5 py-1 text-xs font-bold text-white">
                {pendingCount}
              </span>
            )}
          </div>
        </Link>

        <Link
          href="/admin/logs"
          className="glass-card block rounded-2xl p-4 transition hover:-translate-y-0.5"
        >
          <h3 className="font-bold text-brand-navy">Activity Logs</h3>
          <p className="text-sm text-brand-navy/60">
            ดูประวัติการใช้งานระบบ
          </p>
        </Link>

        <section className="glass-card rounded-2xl p-4">
          <p className="text-sm font-semibold text-brand-navy">อัปเดตราคาอย่างเร็ว</p>
          <p className="mt-1 text-xs text-brand-navy/65">
            แก้ข้อมูลใน Google Sheet แล้วหน้า dashboard จะอัปเดตอัตโนมัติภายในประมาณ 5 นาที
          </p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <a
              href={sheetUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-xl border border-brand-navy/20 bg-white/75 px-3 py-2 text-sm font-semibold text-brand-navy transition hover:bg-white"
            >
              เปิด Sheet เพื่อแก้ไข
            </a>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-xl bg-brand-navy px-3 py-2 text-sm font-semibold text-white transition hover:bg-brand-navy-light"
            >
              กลับหน้า Dashboard
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
