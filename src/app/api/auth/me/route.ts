import { NextResponse } from "next/server";
import { getCurrentStaff } from "@/lib/auth";

export async function GET() {
  const staff = await getCurrentStaff();

  if (!staff) {
    return NextResponse.json({ error: "ไม่ได้เข้าสู่ระบบ" }, { status: 401 });
  }

  return NextResponse.json({ staff });
}
