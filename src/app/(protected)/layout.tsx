import { redirect } from "next/navigation";
import { getCurrentStaff } from "@/lib/auth";
import AppHeader from "@/components/layout/AppHeader";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const staff = await getCurrentStaff();

  if (!staff) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader staff={staff} />
      <main>{children}</main>
    </div>
  );
}
