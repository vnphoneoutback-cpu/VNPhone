"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import type { Product } from "@/lib/types";

interface PriceSummaryProps {
  product: Product;
  quantity: number;
}

function formatModelName(model: string): string {
  if (model.startsWith("IPHONE")) {
    return model
      .replace("IPHONE ", "iPhone ")
      .replace(/ PRO MAX/g, " Pro Max")
      .replace(/ PRO(?! Max)/g, " Pro")
      .replace(/ PLUS/g, " Plus");
  }
  return model.replace(/^APPLE /, "");
}

export default function PriceSummary({
  product,
  quantity,
}: PriceSummaryProps) {
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
    month: "short",
    day: "numeric",
  });
  const thaiTime = now.toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="overflow-hidden rounded-3xl bg-brand-navy shadow-lg">
      {/* Main content */}
      <div className="px-6 pb-5 pt-6 text-center">
        <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500">
          สรุปราคา
        </div>

        <div className="mt-3 text-xl font-extrabold text-white">
          {formatModelName(product.model)}
        </div>

        <div className="mt-1 text-sm text-gray-400">
          {product.storage}
          {quantity > 1 && (
            <span className="text-gray-500">
              {" "}
              &times; {quantity} เครื่อง
            </span>
          )}
        </div>

        {/* Price highlight */}
        <div className="mx-auto mt-5 max-w-[240px] rounded-2xl bg-brand-yellow px-5 py-4">
          <div className="text-[34px] font-black leading-none tracking-tight text-brand-navy">
            {totalPrice.toLocaleString()}
          </div>
          <div className="mt-0.5 text-xs font-bold text-brand-navy/50">
            บาท
          </div>
        </div>

        {quantity > 1 && (
          <div className="mt-2.5 text-[11px] text-gray-500">
            เครื่องละ {product.price.toLocaleString()} บาท
          </div>
        )}

        {/* Meta */}
        <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-gray-600">
          <span>{thaiDate}</span>
          <span className="text-gray-700">&middot;</span>
          <span>{thaiTime}</span>
          {userName && (
            <>
              <span className="text-gray-700">&middot;</span>
              <span>{userName}</span>
            </>
          )}
        </div>
      </div>

      {/* CTA */}
      <a
        href="tel:099-439-5550"
        className="flex items-center justify-center gap-2.5 bg-white/8 py-3.5 transition-colors hover:bg-white/12"
      >
        <svg
          className="h-4 w-4 text-brand-yellow"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
          />
        </svg>
        <span className="text-sm font-bold text-brand-yellow">
          โทรสั่งเลย 099-439-5550
        </span>
      </a>
    </div>
  );
}
