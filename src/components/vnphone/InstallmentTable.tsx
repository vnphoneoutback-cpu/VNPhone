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
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-fade-in-up">
      {/* Header */}
      <div className="bg-brand-navy px-4 py-3">
        <h3 className="font-bold text-white text-lg">{product.model}</h3>
        <p className="text-white/60 text-sm">
          {product.storage}
          {product.note && ` · ${product.note}`}
        </p>
      </div>

      {/* Down payment */}
      {product.downPayment !== null && (
        <div className="px-4 py-3 bg-brand-yellow-light border-b border-gray-200">
          <p className="text-sm text-gray-600">ดาวน์</p>
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
              <div key={term.label} className="bg-white px-4 py-3 text-center">
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
            className="w-full bg-brand-yellow text-brand-navy font-bold py-2.5 rounded-xl hover:bg-brand-yellow-dark transition text-sm"
          >
            แสดงลูกค้า
          </button>
        </div>
      )}
    </div>
  );
}
