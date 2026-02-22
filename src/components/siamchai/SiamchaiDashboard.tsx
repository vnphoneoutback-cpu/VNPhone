"use client";

import { useState, useEffect, useCallback } from "react";
import type { CashProduct, CartItem } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { logActivity } from "@/lib/activity-client";
import ProductSelector from "./ProductSelector";
import CartPanel from "./CartPanel";
import QuoteSummary from "./QuoteSummary";
import SaveImageButton from "./SaveImageButton";

interface SiamchaiDashboardProps {
  staffName: string;
}

export default function SiamchaiDashboard({
  staffName,
}: SiamchaiDashboardProps) {
  const [products, setProducts] = useState<CashProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Product selection state
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedStorage, setSelectedStorage] = useState("");
  const [color, setColor] = useState("");
  const [quantity, setQuantity] = useState(1);

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showQuote, setShowQuote] = useState(false);

  useEffect(() => {
    void logActivity("view_dashboard", { dashboard: "siamchai_quote" });
  }, []);

  useEffect(() => {
    fetch("/api/sheets/cash")
      .then((res) => res.json())
      .then((data) => {
        if (data.products) setProducts(data.products);
        else setError(data.error || "โหลดข้อมูลไม่สำเร็จ");
      })
      .catch(() => setError("ไม่สามารถเชื่อมต่อได้"))
      .finally(() => setLoading(false));
  }, []);

  // Find selected product's price
  const selectedProduct = products.find(
    (p) =>
      p.brand === selectedBrand &&
      p.model === selectedModel &&
      (selectedStorage ? p.storage === selectedStorage : true)
  );

  const addToCart = useCallback(() => {
    if (!selectedProduct) return;

    const newItem: CartItem = {
      id: crypto.randomUUID(),
      brand: selectedProduct.brand,
      model: selectedProduct.model,
      storage: selectedStorage || selectedProduct.storage,
      color: color.trim(),
      quantity,
      unitPrice: selectedProduct.price,
      totalPrice: selectedProduct.price * quantity,
    };

    setCart((prev) => [...prev, newItem]);
    void logActivity("add_to_cart", {
      dashboard: "siamchai_quote",
      brand: newItem.brand,
      model: newItem.model,
      storage: newItem.storage,
      color: newItem.color,
      quantity: newItem.quantity,
      unitPrice: newItem.unitPrice,
      totalPrice: newItem.totalPrice,
    });
    // Reset selection
    setColor("");
    setQuantity(1);
    setSelectedModel("");
    setSelectedStorage("");
    setShowQuote(false);
  }, [selectedProduct, selectedStorage, color, quantity]);

  function removeFromCart(id: string) {
    setCart((prev) => prev.filter((item) => item.id !== id));
    setShowQuote(false);
  }

  function updateCartQuantity(id: string, newQty: number) {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: newQty, totalPrice: item.unitPrice * newQty }
          : item
      )
    );
    setShowQuote(false);
  }

  function handleToggleQuote() {
    setShowQuote((prev) => {
      const next = !prev;
      if (next) {
        const total = cart.reduce((sum, item) => sum + item.totalPrice, 0);
        void logActivity("open_quote", {
          dashboard: "siamchai_quote",
          itemCount: cart.length,
          totalPrice: total,
        });
      }
      return next;
    });
  }

  function handleQuoteSaved(channel: "share" | "download") {
    const total = cart.reduce((sum, item) => sum + item.totalPrice, 0);
    void logActivity("export_quote", {
      dashboard: "siamchai_quote",
      channel,
      itemCount: cart.length,
      totalPrice: total,
    });
  }

  if (loading) {
    return (
      <div className="p-4 space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton h-12 rounded-xl" />
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
    <div className="mx-auto max-w-3xl space-y-4 px-2 pb-8 sm:px-0">
      <section className="glass-card rounded-2xl p-4">
        <h2 className="text-lg font-extrabold text-brand-navy">Siamchai Quote Builder</h2>
        <p className="mt-1 text-sm text-brand-navy/65">
          เลือกสินค้า ใส่จำนวน และสร้างใบสรุปราคาเพื่อส่งต่อให้ทีม VN Phone
        </p>
      </section>

      {/* Product Selection */}
      <div className="glass-card rounded-2xl p-4">
        <h3 className="font-bold text-brand-navy mb-3">เลือกสินค้า</h3>
        <ProductSelector
          products={products}
          selectedBrand={selectedBrand}
          selectedModel={selectedModel}
          selectedStorage={selectedStorage}
          onBrandChange={setSelectedBrand}
          onModelChange={setSelectedModel}
          onStorageChange={setSelectedStorage}
        />

        {/* Show price */}
        {selectedProduct && (
          <div className="mt-3 rounded-xl border border-brand-yellow/50 bg-brand-yellow-light p-3 shadow-[0_10px_24px_rgba(246,197,83,0.2)]">
            <p className="text-sm text-brand-navy/65">ราคา</p>
            <p className="text-2xl font-extrabold text-brand-navy">
              ฿{formatPrice(selectedProduct.price)}
            </p>
          </div>
        )}

        {/* Color input */}
        {selectedProduct && (
          <div className="mt-3">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              สี (ถ้ามี)
            </label>
            <input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              placeholder="เช่น Black, White, Natural Titanium"
              className="lux-input w-full rounded-xl px-3 py-2.5 text-brand-navy outline-none"
            />
          </div>
        )}

        {/* Quantity */}
        {selectedProduct && (
          <div className="mt-3">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              จำนวน
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-brand-navy/15 bg-white/80 text-lg font-bold text-gray-600 transition hover:bg-white"
              >
                -
              </button>
              <span className="text-xl font-bold text-brand-navy w-12 text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-brand-navy/15 bg-white/80 text-lg font-bold text-gray-600 transition hover:bg-white"
              >
                +
              </button>
            </div>
          </div>
        )}

        {/* Add to cart button */}
        {selectedProduct && (
          <button
            onClick={addToCart}
            className="lux-btn-primary mt-4 w-full rounded-xl py-3 font-bold text-brand-navy transition"
          >
            เพิ่มในรายการ · ฿
            {formatPrice(selectedProduct.price * quantity)}
          </button>
        )}
      </div>

      {/* Cart */}
      <CartPanel
        items={cart}
        onRemove={removeFromCart}
        onUpdateQuantity={updateCartQuantity}
      />

      {/* Actions */}
      {cart.length > 0 && (
        <div className="space-y-3">
          <button
            onClick={handleToggleQuote}
            className="lux-btn-secondary w-full rounded-xl py-3 font-bold text-white transition"
          >
            {showQuote ? "ซ่อนใบสรุปราคา" : "สรุปราคา"}
          </button>

          {showQuote && (
            <div className="flex flex-col items-center gap-3 animate-fade-in-up">
              <QuoteSummary items={cart} staffName={staffName} />
              <SaveImageButton
                disabled={cart.length === 0}
                onSaved={handleQuoteSaved}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
