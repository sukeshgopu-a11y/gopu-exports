"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Trash2, Upload, ImageOff } from "lucide-react";

type GalleryImage = {
  url: string;
  name: string;
};

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [loadError, setLoadError] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const loadImages = async () => {
    setLoadError(false);
    try {
      const { supabase } = await import("@/lib/Supabase");
      const { data, error } = await supabase.storage.from("gallery").list("", {
        sortBy: { column: "created_at", order: "desc" },
      });
      if (error) throw error;
      const imgs = (data ?? [])
        .filter((f) => f.name !== ".emptyFolderPlaceholder")
        .map((f) => ({
          name: f.name,
          url: supabase.storage.from("gallery").getPublicUrl(f.name).data.publicUrl,
        }));
      setImages(imgs);
    } catch {
      setLoadError(true);
    }
  };

  useEffect(() => { loadImages(); }, []);

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
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        if (!res.ok) {
          const d = await res.json();
          throw new Error(d.error ?? "Upload failed");
        }
        return res.json() as Promise<{ url: string }>;
      });
      await Promise.all(uploads);
      await loadImages();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const deleteImage = async (name: string) => {
    if (!confirm("Delete this image?")) return;
    const { supabase } = await import("@/lib/Supabase");
    await supabase.storage.from("gallery").remove([name]);
    setImages((prev) => prev.filter((i) => i.name !== name));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-[#0F172A]">Gallery</h1>
          <p className="text-gray-500 mt-1 text-sm">
            {images.length} image{images.length !== 1 ? "s" : ""} · Stored in Supabase
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
            {uploading ? "Uploading…" : "Upload Images"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-5 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
          {error.includes("SUPABASE_SERVICE_ROLE_KEY") && (
            <p className="mt-1 text-xs">
              Add <code className="bg-red-100 px-1 rounded">SUPABASE_SERVICE_ROLE_KEY</code> to
              your <code className="bg-red-100 px-1 rounded">.env.local</code> file, then create
              a public &ldquo;gallery&rdquo; bucket in your Supabase dashboard.
            </p>
          )}
        </div>
      )}

      {loadError && (
        <div className="mb-5 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
          Could not load gallery images. Make sure a public &ldquo;gallery&rdquo; bucket exists in
          your Supabase project and <code className="bg-amber-100 px-1 rounded">NEXT_PUBLIC_SUPABASE_URL</code> is set.
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
            Upload your first image →
          </button>
        </div>
      ) : (
        <div className="grid gap-5 grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {images.map((img) => (
            <div
              key={img.name}
              className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 aspect-square"
            >
              <Image
                src={img.url}
                alt={img.name}
                fill
                sizes="(max-width:768px) 50vw, 25vw"
                className="object-cover"
                unoptimized
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition flex items-center justify-center">
                <button
                  onClick={() => deleteImage(img.name)}
                  className="opacity-0 group-hover:opacity-100 transition bg-red-500 hover:bg-red-600 text-white p-2.5 rounded-full"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-3 py-2 opacity-0 group-hover:opacity-100 transition">
                <p className="text-white text-[10px] truncate">{img.name}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
