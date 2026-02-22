"use client";

import type { InstallmentProduct } from "@/lib/types";
import { formatPrice } from "@/lib/format";

interface InstallmentTableProps {
  product: InstallmentProduct;
  onShowCustomer?: () => void;
}

export default function InstallmentTable({
  product,
  onShowCustomer,
}: InstallmentTableProps) {
  const terms = [
    { label: "6 ด.", value: product.month6 },
    { label: "8 ด.", value: product.month8 },
    { label: "10 ด.", value: product.month10 },
    { label: "12 ด.", value: product.month12 },
  ];

  return (
    <div className="glass-card animate-fade-in-up overflow-hidden rounded-2xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-navy to-brand-navy-light px-4 py-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-bold text-white text-lg">{product.model}</h3>
            <p className="text-white/60 text-sm">
              {product.storage}
              {product.note && ` · ${product.note}`}
            </p>
          </div>
          {product.interestRate && (
            <span className="shrink-0 rounded-full bg-brand-yellow px-2.5 py-1 text-xs font-bold text-brand-navy">
              {product.interestRate}
            </span>
          )}
        </div>
      </div>

      {/* Down payment */}
      {product.downPayment !== null && (
        <div className="border-b border-brand-yellow/40 bg-brand-yellow-light px-4 py-3">
          <p className="text-sm text-brand-navy/65">ดาวน์</p>
          <p className="text-2xl font-bold text-brand-navy">
            ฿{formatPrice(product.downPayment)}
          </p>
        </div>
      )}

      {/* Installment grid */}
      <div className="grid grid-cols-2 gap-px bg-gray-200">
        {terms.map(
          (term) =>
            term.value !== null && (
              <div
                key={term.label}
                className="bg-white/90 px-4 py-3 text-center"
              >
                <p className="text-xs text-gray-500 mb-0.5">{term.label}</p>
                <p className="text-xl font-bold text-brand-navy">
                  ฿{formatPrice(term.value)}
                </p>
                <p className="text-xs text-gray-400">/ เดือน</p>
              </div>
            )
        )}
      </div>

      {/* Show customer button */}
      {onShowCustomer && (
        <div className="p-3 border-t border-gray-200">
          <button
            onClick={onShowCustomer}
            className="lux-btn-primary w-full rounded-xl py-2.5 text-sm font-bold text-brand-navy transition"
          >
            แสดงลูกค้า
          </button>
        </div>
      )}
    </div>
  );
}
