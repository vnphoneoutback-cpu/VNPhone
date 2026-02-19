export const dynamic = "force-dynamic";

import PriceCheckLog from "@/components/PriceCheckLog";
import Link from "next/link";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm text-blue-600 hover:underline"
            >
              &larr; Back
            </Link>
            <h1 className="text-xl font-black tracking-tight text-slate-800">
              VNPhone Admin
            </h1>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-4xl px-4 py-8">
        <h2 className="mb-6 text-lg font-bold text-slate-800">
          Price Check Log
        </h2>
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <PriceCheckLog />
        </div>
      </main>
    </div>
  );
}
