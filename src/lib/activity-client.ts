import type { ActivityAction } from "./types";

export async function logActivity(
  action: ActivityAction,
  details: Record<string, unknown> = {}
) {
  try {
    await fetch("/api/logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, details }),
      keepalive: true,
    });
  } catch {
    // Logging should not block or crash user actions.
  }
}
