"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase";
import type { Product } from "@/lib/types";
import PriceSummary from "./PriceSummary";

export default function PhonePicker() {
  const supabase = createClient();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Selection state
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [selectedStorage, setSelectedStorage] = useState<string>("");
  const [quantity, setQuantity] = useState(1);

  // Result state
  const [showResult, setShowResult] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase
        .from("products")
        .select("*")
        .order("brand")
        .order("model")
        .order("price");

      if (data) setProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, [supabase]);

  // Derived data
  const brands = [...new Set(products.map((p) => p.brand))];
  const models = [
    ...new Set(
      products.filter((p) => p.brand === selectedBrand).map((p) => p.model)
    ),
  ];
  const storages = [
    ...new Set(
      products
        .filter((p) => p.brand === selectedBrand && p.model === selectedModel)
        .map((p) => p.storage)
    ),
  ];

  const handleBrandChange = (brand: string) => {
    setSelectedBrand(brand);
    setSelectedModel("");
    setSelectedStorage("");
    setQuantity(1);
    setShowResult(false);
  };

  const handleModelChange = (model: string) => {
    setSelectedModel(model);
    setSelectedStorage("");
    setQuantity(1);
    setShowResult(false);
  };

  const handleStorageChange = (storage: string) => {
    setSelectedStorage(storage);
    setQuantity(1);
    setShowResult(false);
  };

  const handleCheckPrice = useCallback(async () => {
    const product = products.find(
      (p) =>
        p.brand === selectedBrand &&
        p.model === selectedModel &&
        p.storage === selectedStorage
    );
    if (!product) return;

    setSelectedProduct(product);
    setShowResult(true);

    // Log the price check
    const {
      data: { user },
    } = await supabase.auth.getUser();

    await supabase.from("price_checks").insert({
      user_id: user?.id || null,
      user_name: user?.user_metadata?.full_name || null,
      user_email: user?.email || null,
      product_id: product.id,
      quantity,
      total_price: product.price * quantity,
    });
  }, [
    products,
    selectedBrand,
    selectedModel,
    selectedStorage,
    quantity,
    supabase,
  ]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-brand-yellow border-t-transparent" />
        <p className="mt-3 text-xs text-gray-400">กำลังโหลดข้อมูล...</p>
      </div>
    );
  }

  const currentStep =
    !selectedBrand ? 1 : !selectedModel ? 2 : !selectedStorage ? 3 : 4;

  return (
    <div className="w-full space-y-5">
      {/* Step 1: Brand */}
      <div className="animate-fade-in-up">
        <StepLabel step={1} current={currentStep} label="เลือกยี่ห้อ" />
        <div className="mt-2 flex gap-2">
          {brands.map((brand) => (
            <button
              key={brand}
              onClick={() => handleBrandChange(brand)}
              className={`flex-1 rounded-xl border-2 px-3 py-3 text-sm font-bold transition-all duration-200 ${
                selectedBrand === brand
                  ? "border-brand-yellow bg-brand-yellow-light text-brand-navy shadow-sm"
                  : "border-gray-150 bg-white text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>

      {/* Step 2: Model */}
      {selectedBrand && (
        <div className="animate-fade-in-up">
          <StepLabel step={2} current={currentStep} label="เลือกรุ่น" />
          <select
            value={selectedModel}
            onChange={(e) => handleModelChange(e.target.value)}
            className="mt-2 w-full appearance-none rounded-xl border-2 border-gray-150 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition focus:border-brand-yellow focus:outline-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 12px center",
              backgroundSize: "20px",
            }}
          >
            <option value="">-- เลือกรุ่น --</option>
            {models.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Step 3: Storage */}
      {selectedModel && (
        <div className="animate-fade-in-up">
          <StepLabel step={3} current={currentStep} label="เลือกความจุ" />
          <div className="mt-2 flex gap-2">
            {storages.map((storage) => (
              <button
                key={storage}
                onClick={() => handleStorageChange(storage)}
                className={`flex-1 rounded-xl border-2 px-3 py-3 text-sm font-bold transition-all duration-200 ${
                  selectedStorage === storage
                    ? "border-brand-yellow bg-brand-yellow-light text-brand-navy shadow-sm"
                    : "border-gray-150 bg-white text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                {storage}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 4: Quantity */}
      {selectedStorage && (
        <div className="animate-fade-in-up">
          <StepLabel step={4} current={currentStep} label="จำนวน" />
          <div className="mt-2 flex items-center gap-3">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-gray-150 bg-white text-lg font-bold text-gray-500 transition hover:border-gray-300 hover:text-gray-700 active:scale-95"
            >
              -
            </button>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (val >= 1) setQuantity(val);
              }}
              className="h-11 w-16 rounded-xl border-2 border-gray-150 text-center text-base font-extrabold text-brand-navy focus:border-brand-yellow focus:outline-none"
            />
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-gray-150 bg-white text-lg font-bold text-gray-500 transition hover:border-gray-300 hover:text-gray-700 active:scale-95"
            >
              +
            </button>
            <span className="text-xs text-gray-400">เครื่อง</span>
          </div>
        </div>
      )}

      {/* Check Price Button */}
      {selectedStorage && (
        <div className="animate-fade-in-up pt-1">
          <button
            onClick={handleCheckPrice}
            className="w-full rounded-2xl bg-brand-yellow px-6 py-4 text-base font-extrabold text-brand-navy shadow-lg shadow-brand-yellow/25 transition-all duration-200 hover:bg-brand-yellow-dark hover:shadow-xl active:scale-[0.98]"
          >
            สรุปราคา
          </button>
        </div>
      )}

      {/* Result */}
      {showResult && selectedProduct && (
        <div className="animate-fade-in-up">
          <PriceSummary product={selectedProduct} quantity={quantity} />
        </div>
      )}
    </div>
  );
}

function StepLabel({
  step,
  current,
  label,
}: {
  step: number;
  current: number;
  label: string;
}) {
  const isActive = step === current;
  const isDone = step < current;

  return (
    <div className="flex items-center gap-2">
      <span
        className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
          isDone
            ? "bg-brand-navy text-white"
            : isActive
              ? "bg-brand-yellow text-brand-navy"
              : "bg-gray-200 text-gray-400"
        }`}
      >
        {isDone ? "✓" : step}
      </span>
      <span
        className={`text-xs font-semibold ${
          isActive ? "text-brand-navy" : isDone ? "text-gray-500" : "text-gray-400"
        }`}
      >
        {label}
      </span>
    </div>
  );
}
