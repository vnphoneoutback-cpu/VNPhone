export function formatModelName(model: string): string {
  if (model.startsWith("IPHONE")) {
    return model
      .replace("IPHONE ", "iPhone ")
      .replace(/ PRO MAX/g, " Pro Max")
      .replace(/ PRO(?! Max)/g, " Pro")
      .replace(/ PLUS/g, " Plus");
  }
  return model.replace(/^APPLE /, "");
}

export function getShortName(brand: string, model: string): string {
  if (brand === "IPHONE") {
    return formatModelName(model).replace("iPhone ", "");
  }
  return formatModelName(model);
}

export function getIPhoneSortKey(model: string): number {
  const m = model.toUpperCase();
  const genMatch = m.match(/IPHONE\s+(\d+)/);
  const gen = genMatch ? parseInt(genMatch[1]) : 0;

  let tier = 3; // base
  if (m.includes("PRO MAX")) tier = 0;
  else if (m.includes("PRO") && !m.includes("MAX")) tier = 1;
  else if (m.includes("PLUS")) tier = 2;
  else if (/16E/i.test(m)) tier = 4;

  return -(gen * 10 - tier);
}

export function formatPrice(price: number): string {
  return price.toLocaleString("th-TH");
}

export function formatThaiDate(date: Date): string {
  return date.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatThaiTime(date: Date): string {
  return date.toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
