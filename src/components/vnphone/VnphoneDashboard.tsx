"use client";

import { useState, useEffect, useMemo } from "react";
import type { InstallmentProduct } from "@/lib/types";
import BrandTabs from "./BrandTabs";
import InstallmentTable from "./InstallmentTable";
import CustomerShowCard from "./CustomerShowCard";

export default function VnphoneDashboard() {
  const [products, setProducts] = useState<InstallmentProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [showProduct, setShowProduct] = useState<InstallmentProduct | null>(
    null
  );
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/sheets/installment")
      .then((res) => res.json())
      .then((data) => {
        if (data.products) {
          setProducts(data.products);
          // Auto-select first brand
          const brands = [...new Set<string>(data.products.map((p: InstallmentProduct) => p.brand))];
          if (brands.length > 0) setSelectedBrand(brands[0]);
        } else {
          setError(data.error || "โหลดข้อมูลไม่สำเร็จ");
        }
      })
      .catch(() => setError("ไม่สามารถเชื่อมต่อได้"))
      .finally(() => setLoading(false));
  }, []);

  const brands = useMemo(
    () => [...new Set(products.map((p) => p.brand))],
    [products]
  );

  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => p.brand === selectedBrand);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.model.toLowerCase().includes(q) ||
          p.storage.toLowerCase().includes(q)
      );
    }
    return result;
  }, [products, selectedBrand, search]);

  if (loading) {
    return (
      <div className="p-4 space-y-3">
        <div className="flex gap-2 overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton h-10 w-24 rounded-full shrink-0" />
          ))}
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton h-40 rounded-xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-center">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="pb-8">
      {/* Brand tabs */}
      <div className="sticky top-[52px] z-40 bg-background/95 backdrop-blur-sm py-3 px-4">
        <BrandTabs
          brands={brands}
          selected={selectedBrand}
          onSelect={setSelectedBrand}
        />
        {/* Search */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ค้นหารุ่น..."
          className="mt-2 w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow outline-none text-brand-navy"
        />
      </div>

      {/* Product grid */}
      <div className="px-4 mt-2 space-y-3">
        {filteredProducts.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            <p className="text-lg">ไม่พบสินค้า</p>
          </div>
        ) : (
          filteredProducts.map((product, idx) => (
            <InstallmentTable
              key={`${product.brand}-${product.model}-${product.storage}-${idx}`}
              product={product}
              onShowCustomer={() => setShowProduct(product)}
            />
          ))
        )}
      </div>

      {/* Customer show overlay */}
      {showProduct && (
        <CustomerShowCard
          product={showProduct}
          onClose={() => setShowProduct(null)}
        />
      )}
    </div>
  );
}
