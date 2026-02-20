import { getCurrentStaff } from "@/lib/auth";
import { redirect } from "next/navigation";
import SiamchaiDashboard from "@/components/siamchai/SiamchaiDashboard";
import VnphoneDashboard from "@/components/vnphone/VnphoneDashboard";

export default async function DashboardPage() {
  const staff = await getCurrentStaff();

  if (!staff) redirect("/login");

  return staff.company === "siamchai" ? (
    <SiamchaiDashboard staffName={staff.nickname} />
  ) : (
    <VnphoneDashboard />
  );
}
