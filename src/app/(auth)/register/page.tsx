"use client";

import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    nickname: "",
    email: "",
    phone: "",
    company: "vnphone" as "vnphone" | "siamchai",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        return;
      }

      setSuccess(true);
    } catch {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-xl animate-fade-in-up text-center">
        <div className="text-4xl mb-4">✅</div>
        <h2 className="text-xl font-bold text-brand-navy mb-2">
          สมัครสำเร็จ!
        </h2>
        <p className="text-gray-600 mb-6">
          รอ admin อนุมัติ จะเข้าใช้งานได้
        </p>
        <Link
          href="/login"
          className="inline-block bg-brand-navy text-white font-medium py-2 px-6 rounded-xl hover:bg-brand-navy-light transition"
        >
          กลับหน้า Login
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl p-6 shadow-xl animate-fade-in-up"
    >
      <h2 className="text-xl font-bold text-brand-navy mb-6 text-center">
        สมัครใช้งาน
      </h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-4">
          {error}
        </div>
      )}

      {/* Company selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          บริษัท
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => updateField("company", "vnphone")}
            className={`py-3 rounded-xl font-medium text-sm border-2 transition ${
              form.company === "vnphone"
                ? "border-brand-yellow bg-brand-yellow-light text-brand-navy"
                : "border-gray-200 text-gray-500 hover:border-gray-300"
            }`}
          >
            VN Phone
          </button>
          <button
            type="button"
            onClick={() => updateField("company", "siamchai")}
            className={`py-3 rounded-xl font-medium text-sm border-2 transition ${
              form.company === "siamchai"
                ? "border-brand-yellow bg-brand-yellow-light text-brand-navy"
                : "border-gray-200 text-gray-500 hover:border-gray-300"
            }`}
          >
            สยามชัย
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ชื่อจริง
          </label>
          <input
            type="text"
            value={form.first_name}
            onChange={(e) => updateField("first_name", e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow outline-none transition text-brand-navy"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            นามสกุล
          </label>
          <input
            type="text"
            value={form.last_name}
            onChange={(e) => updateField("last_name", e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow outline-none transition text-brand-navy"
            required
          />
        </div>
      </div>

      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          ชื่อเล่น
        </label>
        <input
          type="text"
          value={form.nickname}
          onChange={(e) => updateField("nickname", e.target.value)}
          className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow outline-none transition text-brand-navy"
          required
        />
      </div>

      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          อีเมล
        </label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => updateField("email", e.target.value)}
          placeholder="email@example.com"
          className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow outline-none transition text-brand-navy"
          required
        />
      </div>

      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          เบอร์โทร
        </label>
        <input
          type="tel"
          value={form.phone}
          onChange={(e) => updateField("phone", e.target.value)}
          placeholder="0812345678"
          className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow outline-none transition text-brand-navy"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-brand-yellow text-brand-navy font-bold py-3 rounded-xl hover:bg-brand-yellow-dark transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "กำลังสมัคร..." : "สมัครใช้งาน"}
      </button>

      <p className="text-center text-sm text-gray-500 mt-4">
        มีบัญชีแล้ว?{" "}
        <Link
          href="/login"
          className="text-brand-navy font-medium hover:underline"
        >
          เข้าสู่ระบบ
        </Link>
      </p>
    </form>
  );
}
