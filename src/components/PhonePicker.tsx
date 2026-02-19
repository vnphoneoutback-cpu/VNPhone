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
  const lastLoggedProductIdRef = useRef<string | null>(null);

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

  const selectedProduct = useMemo(() => {
    if (!selectedBrand || !selectedModel || !selectedStorage) return null;

    return (
      products.find(
        (p) =>
          p.brand === selectedBrand &&
          p.model === selectedModel &&
          p.storage === selectedStorage
      ) || null
    );
  }, [products, selectedBrand, selectedModel, selectedStorage]);

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
    if (!selectedProduct) {
      lastLoggedProductIdRef.current = null;
      return;
    }

    if (lastLoggedProductIdRef.current !== selectedProduct.id) {
      logPriceCheck(selectedProduct);
      lastLoggedProductIdRef.current = selectedProduct.id;
    }

    const timeoutId = window.setTimeout(() => {
      resultRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }, 150);

    return () => window.clearTimeout(timeoutId);
  }, [selectedProduct, logPriceCheck]);

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
      <div className="rounded-[28px] border border-brand-navy/10 bg-white/90 p-5 shadow-[0_16px_36px_rgba(30,42,94,0.12)] backdrop-blur-sm">
        <div className="mb-3 h-3 w-28 rounded-full bg-gray-100" />
        <div className="flex rounded-2xl bg-brand-navy/5 p-1.5">
          <div className="skeleton h-11 flex-1 rounded-xl" />
          <div className="skeleton h-11 flex-1 rounded-xl" />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2.5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton h-28 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  /* ── Render ── */
  return (
    <div className="space-y-5">
      {/* ━━ Brand Tabs ━━ */}
      <div className="rounded-[28px] border border-brand-navy/10 bg-white/92 p-5 shadow-[0_18px_40px_rgba(30,42,94,0.13)] backdrop-blur-sm">
        <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-navy/45">
          เลือกแบรนด์
        </div>
        <div className="flex rounded-2xl bg-brand-navy/5 p-1.5">
          {brands.map((b) => (
            <button
              key={b}
              onClick={() => handleBrandChange(b)}
              className={`flex-1 rounded-xl py-2.5 text-sm font-bold transition-all duration-300 ${
                selectedBrand === b
                  ? "bg-brand-navy text-white shadow-[0_8px_20px_rgba(30,42,94,0.35)]"
                  : "text-brand-navy/45 hover:text-brand-navy/70"
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
              className={`group rounded-2xl border p-3.5 text-left transition-all duration-200 ${
                selectedModel === model
                  ? "border-brand-navy/20 bg-white shadow-[0_10px_24px_rgba(30,42,94,0.12)] ring-2 ring-brand-yellow/65"
                  : "border-brand-navy/5 bg-[#f8f9ff] hover:border-brand-navy/20 hover:bg-white hover:shadow-sm"
              }`}
              style={{ animationDelay: `${idx * 30}ms` }}
            >
              <div
                className={`text-[15px] font-extrabold leading-tight ${
                  selectedModel === model ? "text-brand-navy" : "text-brand-navy/85"
                }`}
              >
                {getShortName(selectedBrand, model)}
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-[10px] text-brand-navy/40">เริ่มต้น</span>
                <span
                  className={`text-sm font-bold ${
                    selectedModel === model
                      ? "text-brand-navy"
                      : "text-brand-navy/70"
                  }`}
                >
                  {minPrice.toLocaleString()}
                </span>
                <span className="text-[10px] text-brand-navy/40">฿</span>
              </div>
              {ms.length > 1 && (
                <div className="mt-1.5 flex items-center gap-1">
                  <div
                    className={`h-1 w-1 rounded-full ${
                      selectedModel === model
                        ? "bg-brand-navy/40"
                        : "bg-brand-navy/20"
                    }`}
                  />
                  <span
                    className={`text-[10px] ${
                      selectedModel === model
                        ? "text-brand-navy/50"
                        : "text-brand-navy/35"
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
          className="animate-fade-in-up rounded-[28px] border border-brand-navy/10 bg-white/92 p-5 shadow-[0_18px_40px_rgba(30,42,94,0.13)] backdrop-blur-sm"
        >
          {/* Selected model label */}
          <div className="mb-4 text-center">
            <span className="inline-block rounded-full bg-brand-navy px-4 py-1.5 text-xs font-bold text-brand-yellow shadow-[0_8px_20px_rgba(30,42,94,0.3)]">
              {formatModelName(selectedModel)}
            </span>
          </div>

          {/* Storage */}
          {storages.length > 1 && (
            <div>
              <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-navy/45">
                เลือกความจุ
              </div>
              <div className="flex gap-2">
                {storages.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleStorageChange(s)}
                    className={`flex-1 rounded-xl py-3 text-sm font-bold transition-all duration-200 ${
                      selectedStorage === s
                        ? "bg-brand-yellow text-brand-navy shadow-[0_10px_22px_rgba(255,193,7,0.35)]"
                        : "bg-brand-navy/5 text-brand-navy/60 hover:bg-brand-navy/10"
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
              className={`flex items-center justify-between ${storages.length > 1 ? "mt-4 border-t border-brand-navy/10 pt-4" : ""}`}
            >
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-navy/45">
                จำนวน
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-navy/10 bg-brand-navy/5 text-base font-bold text-brand-navy/70 transition hover:bg-brand-navy/10 active:scale-90"
                >
                  −
                </button>
                <span className="w-6 text-center text-lg font-black text-brand-navy">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-navy/10 bg-brand-navy/5 text-base font-bold text-brand-navy/70 transition hover:bg-brand-navy/10 active:scale-90"
                >
                  +
                </button>
                <span className="text-[11px] text-brand-navy/45">เครื่อง</span>
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
