"use client";

import { useState, useEffect, useCallback } from "react";
import type { CashProduct, CartItem } from "@/lib/types";
import { formatPrice } from "@/lib/format";
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
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-center">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-lg mx-auto space-y-4 pb-8">
      {/* Product Selection */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
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
          <div className="mt-3 p-3 bg-brand-yellow-light rounded-xl">
            <p className="text-sm text-gray-600">ราคา</p>
            <p className="text-2xl font-bold text-brand-navy">
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
              className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow outline-none text-brand-navy"
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
                className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-lg font-bold text-gray-600 transition"
              >
                -
              </button>
              <span className="text-xl font-bold text-brand-navy w-12 text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-lg font-bold text-gray-600 transition"
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
            className="mt-4 w-full bg-brand-yellow text-brand-navy font-bold py-3 rounded-xl hover:bg-brand-yellow-dark transition"
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
            onClick={() => setShowQuote(!showQuote)}
            className="w-full bg-brand-navy text-white font-bold py-3 rounded-xl hover:bg-brand-navy-light transition"
          >
            {showQuote ? "ซ่อนใบสรุปราคา" : "สรุปราคา"}
          </button>

          {showQuote && (
            <div className="flex flex-col items-center gap-3 animate-fade-in-up">
              <QuoteSummary items={cart} staffName={staffName} />
              <SaveImageButton disabled={cart.length === 0} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
