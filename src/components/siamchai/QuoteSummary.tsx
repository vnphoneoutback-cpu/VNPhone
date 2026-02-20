"use client";

import type { CartItem } from "@/lib/types";
import { formatPrice, formatThaiDate, formatThaiTime } from "@/lib/format";

interface QuoteSummaryProps {
  items: CartItem[];
  staffName: string;
}

export default function QuoteSummary({ items, staffName }: QuoteSummaryProps) {
  const total = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const now = new Date();

  return (
    <div
      id="quote-summary"
      className="bg-white rounded-xl p-5 border-2 border-brand-navy"
      style={{ width: "380px" }}
    >
      {/* Header */}
      <div className="text-center mb-4 pb-3 border-b-2 border-brand-navy">
        <h2 className="text-xl font-bold text-brand-navy">สยามชัย</h2>
        <p className="text-xs text-gray-500 mt-1">ใบเสนอราคา</p>
      </div>

      {/* Items */}
      <div className="space-y-2 mb-4">
        {items.map((item, idx) => (
          <div key={item.id} className="flex justify-between text-sm">
            <div className="flex-1">
              <span className="text-gray-500 mr-1">{idx + 1}.</span>
              <span className="text-brand-navy font-medium">
                {item.model}
              </span>
              {item.storage && (
                <span className="text-gray-500 ml-1">{item.storage}</span>
              )}
              {item.color && (
                <span className="text-gray-400 ml-1">({item.color})</span>
              )}
              {item.quantity > 1 && (
                <span className="text-gray-500 ml-1">x{item.quantity}</span>
              )}
            </div>
            <span className="font-medium text-brand-navy ml-2">
              ฿{formatPrice(item.totalPrice)}
            </span>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="border-t-2 border-brand-navy pt-3 flex justify-between items-center">
        <span className="font-bold text-brand-navy">รวมทั้งสิ้น</span>
        <span className="text-xl font-bold text-brand-navy">
          ฿{formatPrice(total)}
        </span>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-gray-200 text-xs text-gray-400 flex justify-between">
        <span>โดย: {staffName}</span>
        <span>
          {formatThaiDate(now)} {formatThaiTime(now)}
        </span>
      </div>
    </div>
  );
}
