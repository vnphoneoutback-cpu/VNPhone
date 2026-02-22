"use client";

import { useState, useEffect, useMemo } from "react";
import type { InstallmentProduct } from "@/lib/types";
import { logActivity } from "@/lib/activity-client";
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
    void logActivity("view_dashboard", { dashboard: "vnphone_installment" });
  }, []);

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

  function handleShowCustomer(product: InstallmentProduct) {
    setShowProduct(product);
    void logActivity("view_product", {
      dashboard: "vnphone_installment",
      brand: product.brand,
      model: product.model,
      storage: product.storage,
    });
  }

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
        <div className="glass-card rounded-xl border border-red-200 bg-red-50/80 p-4 text-center text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-3 pb-8">
      <section className="glass-card mx-2 rounded-2xl p-4 sm:mx-0">
        <h2 className="text-lg font-extrabold text-brand-navy">VN Installment Calculator</h2>
        <p className="mt-1 text-sm text-brand-navy/65">
          ค้นหารุ่นสินค้าและแสดงยอดดาวน์/ยอดผ่อนเพื่อคุยกับลูกค้าได้ทันที
        </p>
      </section>

      {/* Brand tabs */}
      <div className="sticky top-[76px] z-40 px-2 pt-1 sm:px-0">
        <div className="glass-panel rounded-2xl px-3 py-3">
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
            className="lux-input mt-2 w-full rounded-xl px-3 py-2 text-sm text-brand-navy outline-none"
          />
        </div>
      </div>

      {/* Product grid */}
      <div className="mt-1 space-y-3 px-2 sm:px-0">
        {filteredProducts.length === 0 ? (
          <div className="glass-card rounded-2xl py-12 text-center text-gray-400">
            <p className="text-lg">ไม่พบสินค้า</p>
          </div>
        ) : (
          filteredProducts.map((product, idx) => (
            <InstallmentTable
              key={`${product.brand}-${product.model}-${product.storage}-${idx}`}
              product={product}
              onShowCustomer={() => handleShowCustomer(product)}
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
