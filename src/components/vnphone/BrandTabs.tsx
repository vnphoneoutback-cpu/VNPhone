"use client";

interface BrandTabsProps {
  brands: string[];
  selected: string;
  onSelect: (brand: string) => void;
}

const BRAND_ICONS: Record<string, string> = {
  IPHONE: "📱",
  IPAD: "📲",
  SAMSUNG: "🌐",
  OPPO: "🟢",
  VIVO: "🔵",
  REALME: "🟡",
  HONOR: "🔴",
  REDMI: "🟠",
};

export default function BrandTabs({
  brands,
  selected,
  onSelect,
}: BrandTabsProps) {
  return (
    <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2 scrollbar-hide">
      {brands.map((brand) => (
        <button
          key={brand}
          onClick={() => onSelect(brand)}
          className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${
            selected === brand
              ? "bg-brand-navy text-brand-yellow shadow-[0_8px_20px_rgba(21,43,99,0.35)]"
              : "border border-brand-navy/14 bg-white/80 text-gray-600 hover:border-brand-navy/30 hover:bg-white"
          }`}
        >
          <span className="mr-1">{BRAND_ICONS[brand.toUpperCase()] || "📦"}</span>
          {brand}
        </button>
      ))}
    </div>
  );
}
