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
    <div className="flex gap-2 overflow-x-auto pb-2 px-4 -mx-4 scrollbar-hide">
      {brands.map((brand) => (
        <button
          key={brand}
          onClick={() => onSelect(brand)}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
            selected === brand
              ? "bg-brand-navy text-brand-yellow shadow-md"
              : "bg-white text-gray-600 border border-gray-200 hover:border-brand-navy/30"
          }`}
        >
          <span>{BRAND_ICONS[brand.toUpperCase()] || "📦"}</span>
          {brand}
        </button>
      ))}
    </div>
  );
}
