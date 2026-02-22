"use client";

import type { InstallmentProduct } from "@/lib/types";
import { formatPrice } from "@/lib/format";

interface CustomerShowCardProps {
  product: InstallmentProduct;
  onClose: () => void;
}

export default function CustomerShowCard({
  product,
  onClose,
}: CustomerShowCardProps) {
  const terms = [
    { label: "6 เดือน", value: product.month6 },
    { label: "8 เดือน", value: product.month8 },
    { label: "10 เดือน", value: product.month10 },
    { label: "12 เดือน", value: product.month12 },
  ].filter((t) => t.value !== null);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[radial-gradient(circle_at_20%_20%,rgba(246,197,83,0.25),transparent_30%),radial-gradient(circle_at_80%_0%,rgba(36,69,142,0.38),transparent_35%),#0c1b40] p-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="animate-scale-in w-full max-w-sm rounded-3xl border border-white/20 bg-white/10 p-6 text-center backdrop-blur-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Model name */}
        <h2 className="text-3xl font-bold text-white mb-1">{product.model}</h2>
        <p className="text-white/50 text-lg mb-8">{product.storage}</p>

        {/* Down payment */}
        {product.downPayment !== null && (
          <div className="mb-6">
            <p className="text-brand-yellow text-sm font-medium mb-1">
              เงินดาวน์
            </p>
            <p className="text-5xl font-bold text-brand-yellow">
              ฿{formatPrice(product.downPayment)}
            </p>
          </div>
        )}

        {/* Installment terms */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {terms.map((term) => (
            <div
              key={term.label}
              className="bg-white/10 rounded-2xl p-4"
            >
              <p className="text-white/60 text-sm mb-1">{term.label}</p>
              <p className="text-2xl font-bold text-white">
                ฿{formatPrice(term.value!)}
              </p>
              <p className="text-white/40 text-xs">/ เดือน</p>
            </div>
          ))}
        </div>

        {product.note && (
          <p className="text-white/40 text-sm mb-6">{product.note}</p>
        )}

        {/* Close hint */}
        <p className="text-white/30 text-sm">แตะที่ใดก็ได้เพื่อปิด</p>
      </div>
    </div>
  );
}
