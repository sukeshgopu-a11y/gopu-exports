"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Eye, EyeOff, Trash2, Upload, ImageOff } from "lucide-react";
import { useToast } from "@/components/dashboard/ToastProvider";
import { dashboardFetch, getErrorMessage, redirectIfAuthError } from "@/lib/dashboardApi";

type GalleryImage = {
  id: string;
  title: string | null;
  alt_text: string | null;
  image_url: string;
  storage_path: string | null;
  is_active: boolean;
};

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [loadError, setLoadError] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const loadImages = useCallback(async () => {
    setLoadError(false);
    try {
      setImages(await dashboardFetch<GalleryImage[]>("/api/gallery?limit=250"));
    } catch (err) {
      if (redirectIfAuthError(err)) return;
      setLoadError(true);
      toast.error(getErrorMessage(err, "Failed to load gallery images."));
    }
  }, [toast]);

  useEffect(() => {
    const id = window.setTimeout(() => {
      void loadImages();
    }, 0);
    return () => window.clearTimeout(id);
  }, [loadImages]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setError("");
    setUploading(true);
    try {
      const uploads = Array.from(files).map(async (file) => {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("bucket", "gallery");
        await dashboardFetch<{ url: string }>("/api/upload", { method: "POST", body: fd, timeoutMs: 25000 });
      });
      await Promise.all(uploads);
      await loadImages();
      toast.success("Gallery images uploaded.");
    } catch (err) {
      if (!redirectIfAuthError(err)) {
        const message = getErrorMessage(err, "Upload failed");
        setError(message);
        toast.error(message);
      }
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const toggleImage = async (image: GalleryImage) => {
    setBusyId(image.id);
    try {
      const updated = await dashboardFetch<GalleryImage>(`/api/gallery/${image.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !image.is_active }),
      });
      setImages((prev) => prev.map((item) => (item.id === image.id ? updated : item)));
      toast.success(updated.is_active ? "Gallery image shown publicly." : "Gallery image hidden publicly.");
    } catch (err) {
      if (!redirectIfAuthError(err)) toast.error(getErrorMessage(err, "Gallery update failed."));
    } finally {
      setBusyId(null);
    }
  };

  const deleteImage = async (image: GalleryImage) => {
    if (!confirm("Delete this image?")) return;
    setBusyId(image.id);
    try {
      await dashboardFetch<{ success: boolean }>(`/api/gallery/${image.id}`, { method: "DELETE" });
      setImages((prev) => prev.filter((i) => i.id !== image.id));
      toast.success("Gallery image deleted.");
    } catch (err) {
      if (!redirectIfAuthError(err)) toast.error(getErrorMessage(err, "Delete failed."));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-[#0F172A]">Gallery</h1>
          <p className="text-gray-500 mt-1 text-sm">
            {images.length} image{images.length !== 1 ? "s" : ""} stored in Supabase
          </p>
        </div>
        <div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleUpload}
          />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 bg-[#0E7490] hover:bg-[#0A5A70] disabled:opacity-60 transition text-white px-5 py-3 rounded-xl font-medium text-sm"
          >
            <Upload size={16} />
            {uploading ? "Uploading..." : "Upload Images"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-5 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
          <p className="mt-1 text-xs">Check your Supabase session and gallery storage policies.</p>
        </div>
      )}

      {loadError && (
        <div className="mb-5 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
          Could not load gallery images. Make sure you are logged in as an admin user.
        </div>
      )}

      {images.length === 0 && !loadError ? (
        <div className="bg-white rounded-3xl border border-dashed border-gray-200 flex flex-col items-center justify-center py-20 text-gray-400">
          <ImageOff size={36} className="mb-4 opacity-40" />
          <p className="text-sm font-medium">No images uploaded yet</p>
          <button
            onClick={() => fileRef.current?.click()}
            className="mt-4 text-[#0E7490] font-semibold text-sm hover:underline"
          >
            Upload your first image
          </button>
        </div>
      ) : (
        <div className="grid gap-5 grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {images.map((img) => (
            <div
              key={img.id}
              className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 aspect-square"
            >
              <Image
                src={img.image_url}
                alt={img.alt_text || img.title || "Gallery image"}
                fill
                sizes="(max-width:768px) 50vw, 25vw"
                className={`object-cover ${img.is_active ? "" : "grayscale opacity-60"}`}
                unoptimized
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition flex items-center justify-center">
                <button
                  onClick={() => toggleImage(img)}
                  disabled={busyId === img.id}
                  className="opacity-0 group-hover:opacity-100 transition bg-white hover:bg-gray-100 text-[#0F172A] p-2.5 rounded-full"
                  title={img.is_active ? "Hide image" : "Show image"}
                >
                  {img.is_active ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                <button
                  onClick={() => deleteImage(img)}
                  disabled={busyId === img.id}
                  className="opacity-0 group-hover:opacity-100 transition bg-red-500 hover:bg-red-600 text-white p-2.5 rounded-full ml-2"
                  title="Delete image"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-3 py-2 opacity-0 group-hover:opacity-100 transition">
                <p className="text-white text-[10px] truncate">
                  {img.title || img.storage_path || "Gallery image"} · {img.is_active ? "Visible" : "Hidden"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
