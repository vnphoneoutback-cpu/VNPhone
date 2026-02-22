"use client";

import type { CartItem } from "@/lib/types";
import { formatPrice } from "@/lib/format";

interface CartPanelProps {
  items: CartItem[];
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
}

export default function CartPanel({
  items,
  onRemove,
  onUpdateQuantity,
}: CartPanelProps) {
  const total = items.reduce((sum, item) => sum + item.totalPrice, 0);

  if (items.length === 0) {
    return (
      <div className="glass-card rounded-xl p-6 text-center text-gray-400">
        <div className="text-3xl mb-2">🛒</div>
        <p className="text-sm">ยังไม่มีสินค้าในรายการ</p>
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden rounded-xl">
      <div className="flex items-center justify-between bg-brand-navy px-4 py-3 text-sm font-medium text-white">
        <span>รายการสินค้า ({items.length})</span>
        <span className="text-brand-yellow font-bold">
          ฿{formatPrice(total)}
        </span>
      </div>
      <div className="divide-y divide-gray-100">
        {items.map((item) => (
          <div key={item.id} className="px-4 py-3 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-brand-navy text-sm truncate">
                {item.brand} {item.model}
              </p>
              <p className="text-xs text-gray-500">
                {item.storage}
                {item.color ? ` · ${item.color}` : ""}
                {" · ฿"}
                {formatPrice(item.unitPrice)}
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() =>
                  onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))
                }
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-brand-navy/10 bg-white/80 text-sm font-bold text-gray-600 transition hover:bg-white"
              >
                -
              </button>
              <span className="w-8 text-center text-sm font-medium text-brand-navy">
                {item.quantity}
              </span>
              <button
                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-brand-navy/10 bg-white/80 text-sm font-bold text-gray-600 transition hover:bg-white"
              >
                +
              </button>
            </div>
            <div className="text-right w-20">
              <p className="text-sm font-bold text-brand-navy">
                ฿{formatPrice(item.totalPrice)}
              </p>
            </div>
            <button
              onClick={() => onRemove(item.id)}
              className="text-gray-400 hover:text-red-500 transition text-lg"
              title="ลบ"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
