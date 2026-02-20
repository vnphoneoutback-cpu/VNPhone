import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";
import { signToken, setAuthCookie } from "@/lib/auth";
import type { AuthPayload } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const { identifier } = (await request.json()) as { identifier: string };

    if (!identifier) {
      return NextResponse.json(
        { error: "กรุณากรอกอีเมลหรือเบอร์โทร" },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    // Find staff by email or phone
    const { data: staff } = await supabase
      .from("staff")
      .select("*")
      .or(`email.eq.${identifier},phone.eq.${identifier}`)
      .single();

    if (!staff) {
      return NextResponse.json(
        { error: "ไม่พบบัญชีนี้ในระบบ" },
        { status: 404 }
      );
    }

    if (staff.status === "pending") {
      return NextResponse.json(
        { error: "บัญชีรออนุมัติจาก admin" },
        { status: 403 }
      );
    }

    if (staff.status === "inactive") {
      return NextResponse.json(
        { error: "บัญชีถูกปิดใช้งาน" },
        { status: 403 }
      );
    }

    // Update last_login_at
    await supabase
      .from("staff")
      .update({ last_login_at: new Date().toISOString() })
      .eq("id", staff.id);

    // Log activity
    await supabase.from("activity_logs").insert({
      staff_id: staff.id,
      action: "login",
      details: { method: identifier.includes("@") ? "email" : "phone" },
    });

    // Sign JWT
    const payload: AuthPayload = {
      sub: staff.id,
      email: staff.email,
      role: staff.role,
      nickname: staff.nickname,
      company: staff.company,
    };

    const token = await signToken(payload);
    await setAuthCookie(token);

    return NextResponse.json({
      message: "เข้าสู่ระบบสำเร็จ",
      staff: {
        id: staff.id,
        nickname: staff.nickname,
        role: staff.role,
        company: staff.company,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาด" },
      { status: 500 }
    );
  }
}
