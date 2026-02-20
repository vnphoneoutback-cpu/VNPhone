"use client";

import { useState } from "react";

interface SaveImageButtonProps {
  disabled: boolean;
}

export default function SaveImageButton({ disabled }: SaveImageButtonProps) {
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

      const blob = await new Promise<Blob>((resolve) =>
        canvas.toBlob((b) => resolve(b!), "image/png")
      );

      // Try Web Share API first (mobile → LINE)
      if (navigator.share && navigator.canShare) {
        const file = new File([blob], "quote.png", { type: "image/png" });
        const shareData = { files: [file] };

        if (navigator.canShare(shareData)) {
          await navigator.share(shareData);
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
      className="w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
