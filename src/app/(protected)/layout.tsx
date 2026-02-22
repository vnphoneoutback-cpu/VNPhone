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
    <div className="page-aurora min-h-screen">
      <div className="mx-auto min-h-screen w-full max-w-6xl">
        <AppHeader staff={staff} />
        <main className="px-2 pb-8 pt-4 sm:px-4">{children}</main>
      </div>
    </div>
  );
}
