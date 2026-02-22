"use client";

import { useState } from "react";

interface SaveImageButtonProps {
  disabled: boolean;
  onSaved?: (channel: "share" | "download") => void;
}

export default function SaveImageButton({
  disabled,
  onSaved,
}: SaveImageButtonProps) {
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      const { default: html2canvas } = await import("html2canvas-pro");
      const element = document.getElementById("quote-summary");
      if (!element) return;

      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
      });

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/png")
      );
      if (!blob) throw new Error("Cannot create image blob");

      // Try Web Share API first (mobile → LINE)
      if (navigator.share && navigator.canShare) {
        const file = new File([blob], "quote.png", { type: "image/png" });
        const shareData = { files: [file] };

        if (navigator.canShare(shareData)) {
          await navigator.share(shareData);
          onSaved?.("share");
          return;
        }
      }

      // Fallback: download
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `quote-${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(url);
      onSaved?.("download");
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <button
      onClick={handleSave}
      disabled={disabled || saving}
      className="w-full rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 py-3 font-bold text-white shadow-[0_10px_24px_rgba(22,163,74,0.34)] transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center gap-2"
    >
      {saving ? (
        "กำลังสร้างภาพ..."
      ) : (
        <>
          <span>📤</span> บันทึก / ส่ง LINE
        </>
      )}
    </button>
  );
}
