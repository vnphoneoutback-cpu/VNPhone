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
      ? "bg-brand-yellow text-brand-navy"
      : "bg-blue-500 text-white";

  return (
    <header className="bg-brand-navy text-white px-4 py-3 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-bold text-brand-yellow">VN Phone</h1>
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full ${companyColor}`}
        >
          {companyLabel}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-white/80">{staff.nickname}</span>
        {staff.role === "admin" && (
          <button
            onClick={() => router.push("/admin")}
            className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition"
          >
            Admin
          </button>
        )}
        <button
          onClick={handleLogout}
          className="text-xs bg-white/10 hover:bg-red-500/80 px-3 py-1.5 rounded-lg transition"
        >
          ออก
        </button>
      </div>
    </header>
  );
}
