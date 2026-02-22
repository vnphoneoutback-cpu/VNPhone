"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: identifier.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-card animate-fade-in-up rounded-3xl p-6"
    >
      <h2 className="mb-6 text-center text-2xl font-extrabold text-brand-navy">
        เข้าสู่ระบบ
      </h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-4">
          {error}
        </div>
      )}

      <div className="mb-4">
        <label
          htmlFor="identifier"
          className="mb-1 block text-sm font-medium text-brand-navy/80"
        >
          อีเมล หรือ เบอร์โทร
        </label>
        <input
          id="identifier"
          type="text"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder="email@example.com หรือ 0812345678"
          className="lux-input w-full rounded-xl px-4 py-3 text-brand-navy outline-none transition"
          required
          autoFocus
        />
      </div>

      <button
        type="submit"
        disabled={loading || !identifier.trim()}
        className="lux-btn-primary w-full rounded-xl py-3 font-bold text-brand-navy transition disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
      </button>

      <p className="text-center text-sm text-gray-500 mt-4">
        ยังไม่มีบัญชี?{" "}
        <Link
          href="/register"
          className="font-semibold text-brand-navy hover:underline"
        >
          สมัครใช้งาน
        </Link>
      </p>
    </form>
  );
}
