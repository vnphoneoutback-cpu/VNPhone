"use client";

import { useMemo } from "react";
import type { CashProduct } from "@/lib/types";

interface ProductSelectorProps {
  products: CashProduct[];
  selectedBrand: string;
  selectedModel: string;
  selectedStorage: string;
  onBrandChange: (brand: string) => void;
  onModelChange: (model: string) => void;
  onStorageChange: (storage: string) => void;
}

export default function ProductSelector({
  products,
  selectedBrand,
  selectedModel,
  selectedStorage,
  onBrandChange,
  onModelChange,
  onStorageChange,
}: ProductSelectorProps) {
  const brands = useMemo(
    () => [...new Set(products.map((p) => p.brand))],
    [products]
  );

  const models = useMemo(
    () =>
      selectedBrand
        ? [...new Set(products.filter((p) => p.brand === selectedBrand).map((p) => p.model))]
        : [],
    [products, selectedBrand]
  );

  const storages = useMemo(
    () =>
      selectedModel
        ? [
            ...new Set(
              products
                .filter((p) => p.brand === selectedBrand && p.model === selectedModel)
                .map((p) => p.storage)
                .filter(Boolean)
            ),
          ]
        : [],
    [products, selectedBrand, selectedModel]
  );

  return (
    <div className="space-y-3">
      {/* Brand */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          ยี่ห้อ
        </label>
        <select
          value={selectedBrand}
          onChange={(e) => {
            onBrandChange(e.target.value);
            onModelChange("");
            onStorageChange("");
          }}
          className="lux-input w-full rounded-xl px-3 py-2.5 text-brand-navy outline-none"
        >
          <option value="">-- เลือกยี่ห้อ --</option>
          {brands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      {/* Model */}
      {selectedBrand && (
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            รุ่น
          </label>
          <select
            value={selectedModel}
            onChange={(e) => {
              onModelChange(e.target.value);
              onStorageChange("");
            }}
            className="lux-input w-full rounded-xl px-3 py-2.5 text-brand-navy outline-none"
          >
            <option value="">-- เลือกรุ่น --</option>
            {models.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Storage */}
      {storages.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            ความจุ
          </label>
          <select
            value={selectedStorage}
            onChange={(e) => onStorageChange(e.target.value)}
            className="lux-input w-full rounded-xl px-3 py-2.5 text-brand-navy outline-none"
          >
            <option value="">-- เลือกความจุ --</option>
            {storages.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
