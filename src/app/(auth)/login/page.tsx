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
      className="bg-white rounded-2xl p-6 shadow-xl animate-fade-in-up"
    >
      <h2 className="text-xl font-bold text-brand-navy mb-6 text-center">
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
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          อีเมล หรือ เบอร์โทร
        </label>
        <input
          id="identifier"
          type="text"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder="email@example.com หรือ 0812345678"
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow outline-none transition text-brand-navy"
          required
          autoFocus
        />
      </div>

      <button
        type="submit"
        disabled={loading || !identifier.trim()}
        className="w-full bg-brand-yellow text-brand-navy font-bold py-3 rounded-xl hover:bg-brand-yellow-dark transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
      </button>

      <p className="text-center text-sm text-gray-500 mt-4">
        ยังไม่มีบัญชี?{" "}
        <Link
          href="/register"
          className="text-brand-navy font-medium hover:underline"
        >
          สมัครใช้งาน
        </Link>
      </p>
    </form>
  );
}
