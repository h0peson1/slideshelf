"use client";

import { useState } from "react";
import { getSlideSignedUrl } from "@/app/actions/slides";

export function SlideActionButtons({ slideId }: { slideId: string }) {
  const [loadingMode, setLoadingMode] = useState<"view" | "download" | null>(null);

  async function handleAccess(mode: "view" | "download") {
    setLoadingMode(mode);
    try {
      const res = await getSlideSignedUrl(slideId, mode);
      if (res.success && res.url) {
        if (mode === "view") {
          window.open(res.url, "_blank", "noopener,noreferrer");
        } else {
          // Trigger direct file download
          const link = document.createElement("a");
          link.href = res.url;
          link.download = res.fileName || "lecture-slide";
          link.target = "_blank";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      } else {
        alert(res.error || "Could not retrieve slide link.");
      }
    } catch {
      alert("Error generating slide link. Please try again.");
    } finally {
      setLoadingMode(null);
    }
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <button
        type="button"
        disabled={loadingMode !== null}
        onClick={() => handleAccess("view")}
        className="btn-secondary !min-h-10 !px-3 !text-sm disabled:opacity-60"
      >
        {loadingMode === "view" ? "Opening..." : "Open"}
      </button>
      <button
        type="button"
        disabled={loadingMode !== null}
        onClick={() => handleAccess("download")}
        className="btn-primary !min-h-10 !px-3 !text-sm !shadow-none disabled:opacity-60"
      >
        {loadingMode === "download" ? "Downloading..." : "Download"}
      </button>
    </div>
  );
}
