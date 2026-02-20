import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";
import type { RegisterRequest } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as RegisterRequest;
    const { first_name, last_name, nickname, email, phone, company } = body;

    // Validate required fields
    if (!first_name || !last_name || !nickname || !email || !phone || !company) {
      return NextResponse.json(
        { error: "กรุณากรอกข้อมูลให้ครบ" },
        { status: 400 }
      );
    }

    if (!["vnphone", "siamchai"].includes(company)) {
      return NextResponse.json(
        { error: "บริษัทไม่ถูกต้อง" },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    // Check duplicate email
    const { data: existingEmail } = await supabase
      .from("staff")
      .select("id")
      .eq("email", email)
      .single();

    if (existingEmail) {
      return NextResponse.json(
        { error: "อีเมลนี้ถูกใช้แล้ว" },
        { status: 409 }
      );
    }

    // Check duplicate phone
    const { data: existingPhone } = await supabase
      .from("staff")
      .select("id")
      .eq("phone", phone)
      .single();

    if (existingPhone) {
      return NextResponse.json(
        { error: "เบอร์โทรนี้ถูกใช้แล้ว" },
        { status: 409 }
      );
    }

    // Insert new staff (status = pending)
    const { data, error } = await supabase
      .from("staff")
      .insert({
        first_name,
        last_name,
        nickname,
        email,
        phone,
        company,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: "ไม่สามารถสมัครได้ กรุณาลองใหม่" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "สมัครสำเร็จ รอ admin อนุมัติ",
      staff: { id: data.id, nickname: data.nickname, status: data.status },
    });
  } catch {
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาด" },
      { status: 500 }
    );
  }
}
