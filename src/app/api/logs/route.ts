import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";
import type { ActivityAction } from "@/lib/types";

const ALLOWED_ACTIONS: ActivityAction[] = [
  "login",
  "view_dashboard",
  "view_product",
  "add_to_cart",
  "open_quote",
  "export_quote",
  "admin_update_staff",
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isActivityAction(value: string): value is ActivityAction {
  return ALLOWED_ACTIONS.includes(value as ActivityAction);
}

export async function GET(request: NextRequest) {
  const role = request.headers.get("x-staff-role");
  if (role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const supabase = createServerClient();

  const rawLimit = Number(request.nextUrl.searchParams.get("limit"));
  const limit = Number.isFinite(rawLimit)
    ? Math.min(Math.max(Math.floor(rawLimit), 1), 200)
    : 50;

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
  const staffId = request.headers.get("x-staff-id");
  if (!staffId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!isRecord(body) || typeof body.action !== "string") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const action = body.action.trim();
  if (!isActivityAction(action)) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  const details = isRecord(body.details) ? body.details : {};

  const supabase = createServerClient();
  const { error } = await supabase.from("activity_logs").insert({
    staff_id: staffId,
    action,
    details,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
