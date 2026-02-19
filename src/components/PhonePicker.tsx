"use client";

import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase";
import type { Product } from "@/lib/types";
import PriceSummary from "./PriceSummary";

/* ────────────────────────────────────
   Helpers
   ──────────────────────────────────── */

function formatModelName(model: string): string {
  if (model.startsWith("IPHONE")) {
    return model
      .replace("IPHONE ", "iPhone ")
      .replace(/ PRO MAX/g, " Pro Max")
      .replace(/ PRO(?! Max)/g, " Pro")
      .replace(/ PLUS/g, " Plus");
  }
  return model.replace(/^APPLE /, "");
}

function getShortName(brand: string, model: string): string {
  if (brand === "IPHONE") {
    return formatModelName(model).replace("iPhone ", "");
  }
  return formatModelName(model);
}

function getIPhoneSortKey(model: string): number {
  const m = model.toUpperCase();
  const genMatch = m.match(/IPHONE\s+(\d+)/);
  const gen = genMatch ? parseInt(genMatch[1]) : 0;

  let tier = 3; // base
  if (m.includes("PRO MAX")) tier = 0;
  else if (m.includes("PRO") && !m.includes("MAX")) tier = 1;
  else if (m.includes("PLUS")) tier = 2;
  else if (/16E/i.test(m)) tier = 4;

  // Higher gen + lower tier = appears first (negative = first in ascending sort)
  return -(gen * 10 - tier);
}

interface ModelGroup {
  model: string;
  minPrice: number;
  maxPrice: number;
  storages: string[];
}

/* ────────────────────────────────────
   Component
   ──────────────────────────────────── */

export default function PhonePicker() {
  const supabase = createClient();
  const configRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [selectedStorage, setSelectedStorage] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  /* ── Fetch products ── */
  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase
        .from("products")
        .select("*")
        .order("brand")
        .order("model")
        .order("price");

      if (data) {
        setProducts(data);
        const brands = [...new Set(data.map((p) => p.brand))];
        if (brands.length > 0) setSelectedBrand(brands[0]);
      }
      setLoading(false);
    };
    fetchProducts();
  }, [supabase]);

  /* ── Derived ── */
  const brands = useMemo(
    () => [...new Set(products.map((p) => p.brand))],
    [products]
  );

  const modelGroups = useMemo((): ModelGroup[] => {
    const filtered = products.filter((p) => p.brand === selectedBrand);
    const map = new Map<string, ModelGroup>();

    for (const p of filtered) {
      const g = map.get(p.model);
      if (!g) {
        map.set(p.model, {
          model: p.model,
          minPrice: p.price,
          maxPrice: p.price,
          storages: [p.storage],
        });
      } else {
        g.minPrice = Math.min(g.minPrice, p.price);
        g.maxPrice = Math.max(g.maxPrice, p.price);
        if (!g.storages.includes(p.storage)) g.storages.push(p.storage);
      }
    }

    const groups = [...map.values()];
    if (selectedBrand === "IPHONE") {
      return groups.sort(
        (a, b) => getIPhoneSortKey(a.model) - getIPhoneSortKey(b.model)
      );
    }
    return groups.sort((a, b) => b.maxPrice - a.maxPrice);
  }, [products, selectedBrand]);

  const storages = useMemo(
    () => [
      ...new Set(
        products
          .filter(
            (p) => p.brand === selectedBrand && p.model === selectedModel
          )
          .map((p) => p.storage)
      ),
    ],
    [products, selectedBrand, selectedModel]
  );

  /* ── Auto-resolve product + log ── */
  const logPriceCheck = useCallback(
    async (product: Product) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      await supabase.from("price_checks").insert({
        user_id: user?.id || null,
        user_name: user?.user_metadata?.full_name || null,
        user_email: user?.email || null,
        product_id: product.id,
        quantity: 1,
        total_price: product.price,
      });
    },
    [supabase]
  );

  useEffect(() => {
    if (selectedBrand && selectedModel && selectedStorage) {
      const product = products.find(
        (p) =>
          p.brand === selectedBrand &&
          p.model === selectedModel &&
          p.storage === selectedStorage
      );
      if (product) {
        setSelectedProduct(product);
        logPriceCheck(product);
        setTimeout(() => {
          resultRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          });
        }, 150);
      }
    } else {
      setSelectedProduct(null);
    }
  }, [selectedBrand, selectedModel, selectedStorage, products, logPriceCheck]);

  /* ── Handlers ── */
  const handleBrandChange = (brand: string) => {
    setSelectedBrand(brand);
    setSelectedModel("");
    setSelectedStorage("");
    setQuantity(1);
  };

  const handleModelChange = (model: string) => {
    setSelectedModel(model);
    setSelectedStorage("");
    setQuantity(1);

    // Auto-select if only 1 storage option
    const modelStorages = [
      ...new Set(
        products
          .filter((p) => p.brand === selectedBrand && p.model === model)
          .map((p) => p.storage)
      ),
    ];
    if (modelStorages.length === 1) {
      setSelectedStorage(modelStorages[0]);
    }

    setTimeout(() => {
      configRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }, 100);
  };

  const handleStorageChange = (storage: string) => {
    setSelectedStorage(storage);
    setQuantity(1);
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="rounded-3xl bg-white p-5 shadow-sm">
        <div className="flex rounded-2xl bg-gray-100 p-1.5">
          <div className="skeleton h-10 flex-1 rounded-xl" />
          <div className="skeleton h-10 flex-1 rounded-xl" />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2.5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton h-24 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  /* ── Render ── */
  return (
    <div className="space-y-4">
      {/* ━━ Brand Tabs ━━ */}
      <div className="rounded-3xl bg-white p-5 shadow-sm">
        <div className="flex rounded-2xl bg-gray-100 p-1.5">
          {brands.map((b) => (
            <button
              key={b}
              onClick={() => handleBrandChange(b)}
              className={`flex-1 rounded-xl py-2.5 text-sm font-bold transition-all duration-300 ${
                selectedBrand === b
                  ? "bg-brand-navy text-white shadow-sm"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {b === "IPHONE" ? "iPhone" : "iPad"}
            </button>
          ))}
        </div>

        {/* ━━ Model Grid ━━ */}
        <div className="mt-4 grid grid-cols-2 gap-2.5">
          {modelGroups.map(({ model, minPrice, storages: ms }, idx) => (
            <button
              key={model}
              onClick={() => handleModelChange(model)}
              className={`group rounded-2xl border-2 p-3.5 text-left transition-all duration-200 ${
                selectedModel === model
                  ? "border-brand-yellow bg-brand-yellow-light shadow-sm"
                  : "border-transparent bg-[#f8f8fa] hover:border-gray-200 hover:shadow-sm"
              }`}
              style={{ animationDelay: `${idx * 30}ms` }}
            >
              <div
                className={`text-[15px] font-extrabold leading-tight ${
                  selectedModel === model ? "text-brand-navy" : "text-gray-800"
                }`}
              >
                {getShortName(selectedBrand, model)}
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-[10px] text-gray-400">เริ่มต้น</span>
                <span
                  className={`text-sm font-bold ${
                    selectedModel === model
                      ? "text-brand-navy"
                      : "text-gray-600"
                  }`}
                >
                  {minPrice.toLocaleString()}
                </span>
                <span className="text-[10px] text-gray-400">฿</span>
              </div>
              {ms.length > 1 && (
                <div className="mt-1.5 flex items-center gap-1">
                  <div
                    className={`h-1 w-1 rounded-full ${
                      selectedModel === model
                        ? "bg-brand-navy/40"
                        : "bg-gray-300"
                    }`}
                  />
                  <span
                    className={`text-[10px] ${
                      selectedModel === model
                        ? "text-brand-navy/50"
                        : "text-gray-300"
                    }`}
                  >
                    {ms.length} ความจุ
                  </span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ━━ Configuration Panel ━━ */}
      {selectedModel && (
        <div
          ref={configRef}
          className="animate-fade-in-up rounded-3xl bg-white p-5 shadow-sm"
        >
          {/* Selected model label */}
          <div className="mb-4 text-center">
            <span className="inline-block rounded-full bg-brand-navy px-4 py-1.5 text-xs font-bold text-white">
              {formatModelName(selectedModel)}
            </span>
          </div>

          {/* Storage */}
          {storages.length > 1 && (
            <div>
              <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                เลือกความจุ
              </div>
              <div className="flex gap-2">
                {storages.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleStorageChange(s)}
                    className={`flex-1 rounded-xl py-3 text-sm font-bold transition-all duration-200 ${
                      selectedStorage === s
                        ? "bg-brand-yellow text-brand-navy shadow-sm"
                        : "bg-[#f8f8fa] text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          {selectedStorage && (
            <div
              className={`flex items-center justify-between ${storages.length > 1 ? "mt-4 border-t border-gray-100 pt-4" : ""}`}
            >
              <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                จำนวน
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f0f0f2] text-base font-bold text-gray-500 transition hover:bg-gray-200 active:scale-90"
                >
                  −
                </button>
                <span className="w-6 text-center text-lg font-black text-brand-navy">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f0f0f2] text-base font-bold text-gray-500 transition hover:bg-gray-200 active:scale-90"
                >
                  +
                </button>
                <span className="text-[11px] text-gray-400">เครื่อง</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ━━ Price Result ━━ */}
      {selectedProduct && (
        <div ref={resultRef} className="animate-scale-in">
          <PriceSummary product={selectedProduct} quantity={quantity} />
        </div>
      )}
    </div>
  );
}
