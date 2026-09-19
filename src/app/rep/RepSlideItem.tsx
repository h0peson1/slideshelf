"use client";

import { useRef, useState } from "react";
import { deleteSlide, replaceSlideFile, getSlideSignedUrl } from "@/app/actions/slides";

type SlideData = {
  id: string;
  courseId: string;
  courseCode: string;
  courseTitle: string;
  title: string;
  week: number;
  fileName: string;
  fileType: string;
  fileSize: string;
  uploadedAt: string;
};

export function RepSlideItem({ slide }: { slide: SlideData }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [deleted, setDeleted] = useState(false);

  if (deleted) return null;

  async function handleDelete() {
    if (!confirm(`Are you sure you want to delete "${slide.title}"? This permanently removes the file.`)) {
      return;
    }

    setLoading(true);
    try {
      const res = await deleteSlide(slide.id);
      if (res.success) {
        setDeleted(true);
      } else {
        alert(res.error || "Failed to delete slide.");
      }
    } catch {
      alert("Error deleting slide.");
    } finally {
      setLoading(false);
    }
  }

  async function handleReplaceFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await replaceSlideFile(slide.id, formData);
      if (res.success) {
        alert("File successfully replaced on shelf.");
        window.location.reload();
      } else {
        alert(res.error || "Failed to replace slide file.");
      }
    } catch {
      alert("Error uploading replacement file.");
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleOpen() {
    try {
      const res = await getSlideSignedUrl(slide.id, "view");
      if (res.success && res.url) {
        window.open(res.url, "_blank", "noopener,noreferrer");
      } else {
        alert(res.error || "Failed to open slide.");
      }
    } catch {
      alert("Error opening slide.");
    }
  }

  return (
    <div className="flex items-start justify-between gap-4 border-b border-[var(--line)] py-4 last:border-b-0">
      <input
        type="file"
        ref={fileInputRef}
        accept=".pdf,.ppt,.pptx"
        className="sr-only"
        onChange={handleReplaceFile}
      />
      <div>
        <div className="flex items-center gap-2">
          <span className="rounded bg-mist px-1.5 py-0.5 text-xs font-bold text-shelf">
            {slide.courseCode}
          </span>
          <p className="font-semibold text-ink">{slide.title}</p>
        </div>
        <p className="mt-1 text-sm text-ink-soft">
          Week {slide.week} · {slide.fileType} · {slide.fileSize} · {slide.uploadedAt}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-3 text-sm font-semibold">
        <button
          type="button"
          disabled={loading}
          onClick={handleOpen}
          className="text-shelf hover:underline disabled:opacity-50"
        >
          View
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={() => fileInputRef.current?.click()}
          className="text-accent hover:opacity-80 disabled:opacity-50"
        >
          {loading ? "..." : "Replace"}
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={handleDelete}
          className="text-ink-soft hover:text-accent disabled:opacity-50"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
