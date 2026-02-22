import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const role = request.headers.get("x-staff-role");
  const adminId = request.headers.get("x-staff-id");
  if (role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();
  const { status, role: newRole } = body as {
    status?: string;
    role?: string;
  };

  const updates: Record<string, unknown> = {};
  if (status && ["active", "inactive", "pending"].includes(status)) {
    updates.status = status;
    if (status === "active" && adminId) {
      updates.approved_by = adminId;
    }
  }
  if (newRole && ["admin", "staff"].includes(newRole)) {
    updates.role = newRole;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "ไม่มีข้อมูลที่จะอัปเดต" }, { status: 400 });
  }

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("staff")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (adminId) {
    await supabase.from("activity_logs").insert({
      staff_id: adminId,
      action: "admin_update_staff",
      details: {
        target_staff_id: id,
        updates,
      },
    });
  }

  return NextResponse.json({ staff: data });
}
