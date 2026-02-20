import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";

export async function GET(request: NextRequest) {
  const supabase = createServerClient();

  const limit = Number(request.nextUrl.searchParams.get("limit")) || 50;

  const { data, error } = await supabase
    .from("activity_logs")
    .select("*, staff:staff_id(id, nickname, company)")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ logs: data });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const staffId = request.headers.get("x-staff-id");

  const supabase = createServerClient();
  const { error } = await supabase.from("activity_logs").insert({
    staff_id: staffId,
    action: body.action,
    details: body.details || {},
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
