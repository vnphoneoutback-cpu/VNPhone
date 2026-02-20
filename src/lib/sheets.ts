import type { CashProduct, InstallmentProduct } from "./types";

// Google Sheets CSV export URLs
// Format: https://docs.google.com/spreadsheets/d/{SHEET_ID}/gviz/tq?tqx=out:csv&sheet={TAB_NAME}
const SHEET_ID = process.env.GOOGLE_SHEET_ID || "";
const BASE_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv`;

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function parseCSV(csv: string): string[][] {
  const lines = csv.split("\n").filter((line) => line.trim());
  return lines.map(parseCSVLine);
}

function parseNumber(val: string): number | null {
  const cleaned = val.replace(/[",฿\s]/g, "");
  if (!cleaned || cleaned === "-" || cleaned === "") return null;
  const num = Number(cleaned);
  return isNaN(num) ? null : num;
}

// ============================================
// Fetch Cash Products (Tab: "ซื้อ สด")
// ============================================

export async function fetchCashProducts(): Promise<CashProduct[]> {
  const url = `${BASE_URL}&sheet=${encodeURIComponent("ซื้อ สด")}`;

  const res = await fetch(url, { next: { revalidate: 300 } });
  if (!res.ok) throw new Error(`Failed to fetch cash products: ${res.status}`);

  const csv = await res.text();
  const rows = parseCSV(csv);

  // Skip header row
  const products: CashProduct[] = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row[0] || !row[1]) continue;

    const brand = row[0]?.trim().toUpperCase() || "";
    const model = row[1]?.trim() || "";
    const storage = row[2]?.trim() || "";
    const price = parseNumber(row[3] || "");
    // row[4] = skip (dash column)
    const color = row[5]?.trim() || "";

    if (brand && model && price !== null) {
      products.push({ brand, model, storage, price, color });
    }
  }

  return products;
}

// ============================================
// Fetch Installment Products (Tab: "ผ่อน")
// ============================================

export async function fetchInstallmentProducts(): Promise<InstallmentProduct[]> {
  const url = `${BASE_URL}&sheet=${encodeURIComponent("ผ่อน")}`;

  const res = await fetch(url, { next: { revalidate: 300 } });
  if (!res.ok) throw new Error(`Failed to fetch installment products: ${res.status}`);

  const csv = await res.text();
  const rows = parseCSV(csv);

  // Skip header row
  const products: InstallmentProduct[] = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row[0] || !row[1]) continue;

    const brand = row[0]?.trim().toUpperCase() || "";
    const model = row[1]?.trim() || "";
    const storage = row[2]?.trim() || "";
    const downPayment = parseNumber(row[3] || "");
    const month6 = parseNumber(row[4] || "");
    const month8 = parseNumber(row[5] || "");
    const month10 = parseNumber(row[6] || "");
    const month12 = parseNumber(row[7] || "");
    const note = row[8]?.trim() || "";

    if (brand && model) {
      products.push({
        brand,
        model,
        storage,
        downPayment,
        month6,
        month8,
        month10,
        month12,
        note,
      });
    }
  }

  return products;
}
