import { redirect } from "next/navigation";
import { getPayloadFromCookie } from "@/lib/auth";

export default async function Home() {
  const payload = await getPayloadFromCookie();

  if (payload) {
    redirect("/dashboard");
  } else {
    redirect("/login");
  }
}
