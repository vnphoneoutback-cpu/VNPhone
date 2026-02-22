"use client";

import { useRouter } from "next/navigation";
import type { Staff } from "@/lib/types";

interface AppHeaderProps {
  staff: Staff;
}

export default function AppHeader({ staff }: AppHeaderProps) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  const companyLabel =
    staff.company === "vnphone" ? "VN Phone" : "สยามชัย";
  const companyColor =
    staff.company === "vnphone"
      ? "bg-brand-yellow/85 text-brand-navy"
      : "bg-blue-500/85 text-white";

  return (
    <header className="sticky top-0 z-50 px-2 pt-2 sm:px-4">
      <div className="glass-panel rounded-2xl px-4 py-3 shadow-[0_10px_32px_rgba(12,27,64,0.16)]">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <h1 className="truncate bg-gradient-to-r from-brand-navy to-brand-navy-light bg-clip-text text-lg font-extrabold tracking-tight text-transparent">
              VN Phone
            </h1>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${companyColor}`}
            >
              {companyLabel}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden text-sm font-medium text-brand-navy/80 sm:inline">
              {staff.nickname}
            </span>
            {staff.role === "admin" && (
              <button
                onClick={() => router.push("/admin")}
                className="rounded-lg border border-brand-navy/20 bg-white/70 px-3 py-1.5 text-xs font-semibold text-brand-navy transition hover:bg-white"
              >
                Admin
              </button>
            )}
            <button
              onClick={handleLogout}
              className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100"
            >
              ออก
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
