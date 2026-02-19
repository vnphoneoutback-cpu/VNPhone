"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import type { Product } from "@/lib/types";

interface PriceSummaryProps {
  product: Product;
  quantity: number;
}

export default function PriceSummary({ product, quantity }: PriceSummaryProps) {
  const [userName, setUserName] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserName(user.user_metadata?.full_name || user.email || null);
      }
    };
    getUser();
  }, [supabase]);

  const totalPrice = product.price * quantity;
  const now = new Date();
  const thaiDate = now.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });
  const thaiTime = now.toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg">
      {/* Header */}
      <div className="bg-brand-navy px-5 py-3">
        <h3 className="text-center text-sm font-bold text-white">
          สรุปราคา
        </h3>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="space-y-3 text-sm">
          <Row label="รุ่น" value={product.model} />
          <Row label="ความจุ" value={product.storage} />
          <Row
            label="ราคา/เครื่อง"
            value={`${product.price.toLocaleString()} บาท`}
          />
          <Row label="จำนวน" value={`${quantity} เครื่อง`} />
        </div>

        {/* Total */}
        <div className="mt-4 rounded-xl bg-brand-yellow-light p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-brand-navy">ราคารวม</span>
            <span className="text-2xl font-extrabold text-brand-navy">
              {totalPrice.toLocaleString()}
              <span className="ml-1 text-sm font-bold">บาท</span>
            </span>
          </div>
        </div>

        {/* Meta info */}
        <div className="mt-4 space-y-1.5 border-t border-gray-100 pt-3">
          <div className="flex justify-between text-[11px]">
            <span className="text-gray-400">วันที่</span>
            <span className="text-gray-500">{thaiDate}</span>
          </div>
          <div className="flex justify-between text-[11px]">
            <span className="text-gray-400">เวลา</span>
            <span className="text-gray-500">{thaiTime}</span>
          </div>
          {userName && (
            <div className="flex justify-between text-[11px]">
              <span className="text-gray-400">ผู้ตรวจสอบ</span>
              <span className="font-medium text-gray-600">{userName}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-400">{label}</span>
      <span className="font-semibold text-gray-800">{value}</span>
    </div>
  );
}
