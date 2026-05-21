import { NextResponse } from "next/server";
import { requireAdminClient, unauthorized } from "@/lib/adminAuth";
import { createAdminClient } from "@/src/lib/supabase/admin";
import { randomUUID } from "crypto";

const ALLOWED_IMAGE_TYPES = new Set(["image/png", "image/jpeg", "image/webp", "image/gif"]);
const ALLOWED_IMAGE_EXTENSIONS = new Set(["png", "jpg", "jpeg", "webp", "gif"]);
const BLOCKED_EXTENSIONS = new Set(["exe", "php", "sh", "bat", "cmd", "ps1", "js", "mjs", "vbs", "jar", "scr", "com"]);
const ALLOWED_BUCKETS = new Set(["products", "gallery", "certifications", "blogs"]);
const MAX_IMAGE_SIZE = 4 * 1024 * 1024;

export const runtime = "nodejs";

function getStorageClient(fallbackClient: Awaited<ReturnType<typeof requireAdminClient>>) {
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return createAdminClient();
  }
  return fallbackClient;
}

async function ensurePublicBucket(
  storageClient: NonNullable<Awaited<ReturnType<typeof requireAdminClient>>>,
  bucket: string
) {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return;
  const { data: bucketInfo } = await storageClient.storage.getBucket(bucket);
  if (bucketInfo) return;
  const { error } = await storageClient.storage.createBucket(bucket, {
    public: true,
    fileSizeLimit: MAX_IMAGE_SIZE,
    allowedMimeTypes: Array.from(ALLOWED_IMAGE_TYPES),
  });
  if (error && !/already exists/i.test(error.message)) {
    throw new Error(`Could not prepare ${bucket} storage bucket: ${error.message}`);
  }
}

function extensionParts(filename: string) {
  return filename
    .toLowerCase()
    .split(".")
    .slice(1)
    .map((part) => part.replace(/[^a-z0-9]/g, ""))
    .filter(Boolean);
}

function hasBlockedExtension(filename: string) {
  return extensionParts(filename).some((part) => BLOCKED_EXTENSIONS.has(part));
}

function finalExtension(filename: string) {
  const parts = extensionParts(filename);
  return parts.at(-1) || "";
}

async function hasValidImageSignature(file: File) {
  const bytes = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  const ascii = String.fromCharCode(...bytes);

  if (file.type === "image/jpeg") return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (file.type === "image/png") {
    return bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
  }
  if (file.type === "image/gif") return ascii.startsWith("GIF87a") || ascii.startsWith("GIF89a");
  if (file.type === "image/webp") return ascii.startsWith("RIFF") && ascii.slice(8, 12) === "WEBP";

  return false;
}

export async function POST(req: Request) {
  const sessionClient = await requireAdminClient();
  if (!sessionClient) return unauthorized();

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const requestedBucket = String(formData.get("bucket") || "gallery")
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "");
    const bucket = requestedBucket || "gallery";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    if (!ALLOWED_BUCKETS.has(bucket)) {
      return NextResponse.json({ error: "Unsupported upload bucket" }, { status: 400 });
    }
    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      return NextResponse.json({ error: "Only JPG, PNG, WebP, or GIF uploads are allowed" }, { status: 400 });
    }
    if (hasBlockedExtension(file.name)) {
      return NextResponse.json({ error: "Unsafe file extension detected" }, { status: 400 });
    }
    const ext = finalExtension(file.name);
    if (!ALLOWED_IMAGE_EXTENSIONS.has(ext)) {
      return NextResponse.json({ error: "Only image file extensions are allowed" }, { status: 400 });
    }
    if (file.size > MAX_IMAGE_SIZE) {
      return NextResponse.json({ error: "Image must be 4 MB or smaller" }, { status: 400 });
    }
    if (!(await hasValidImageSignature(file))) {
      return NextResponse.json({ error: "The uploaded file does not match a supported image format" }, { status: 400 });
    }

    const filename = `${randomUUID()}.${ext === "jpeg" ? "jpg" : ext}`;
    const storagePath = filename;
    const uploadBucket = bucket;
    const supabase = getStorageClient(sessionClient);
    if (!supabase) return unauthorized();

    await ensurePublicBucket(supabase, uploadBucket);

    const { error } = await supabase.storage
      .from(uploadBucket)
      .upload(storagePath, file, { contentType: file.type, upsert: false });

    if (error) {
      return NextResponse.json({ error: `Upload failed: ${error.message}` }, { status: 500 });
    }

    const { data } = supabase.storage.from(uploadBucket).getPublicUrl(storagePath);
    if (bucket === "gallery") {
      await sessionClient.from("gallery_images").insert({
        title: file.name.replace(/\.[^.]+$/, ""),
        alt_text: file.name.replace(/\.[^.]+$/, ""),
        image_url: data.publicUrl,
        storage_path: storagePath,
        bucket: uploadBucket,
        is_active: true,
      });
    }
    return NextResponse.json({ url: data.publicUrl, bucket: uploadBucket, path: storagePath });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
