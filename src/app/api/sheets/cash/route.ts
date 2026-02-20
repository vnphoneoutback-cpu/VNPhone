import { NextResponse } from "next/server";
import { fetchCashProducts } from "@/lib/sheets";

export async function GET() {
  try {
    const products = await fetchCashProducts();
    return NextResponse.json({ products });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "ไม่สามารถโหลดข้อมูลสินค้าได้", detail: message },
      { status: 500 }
    );
  }
}
