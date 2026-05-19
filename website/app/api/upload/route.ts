import { NextResponse } from "next/server";
import { requireAdminClient, unauthorized } from "@/lib/adminAuth";

export async function POST(req: Request) {
  const supabase = await requireAdminClient();
  if (!supabase) return unauthorized();

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const bucket = (formData.get("bucket") as string) || "gallery";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image uploads are allowed" }, { status: 400 });
    }
    if (file.size > 4 * 1024 * 1024) {
      return NextResponse.json({ error: "Image must be 4 MB or smaller" }, { status: 400 });
    }

    const ext = (file.name.split(".").pop() || "webp").toLowerCase().replace(/[^a-z0-9]/g, "");
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error } = await supabase.storage
      .from(bucket)
      .upload(filename, file, { contentType: file.type, upsert: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(filename);
    if (bucket === "gallery") {
      await supabase.from("gallery_images").insert({
        title: file.name.replace(/\.[^.]+$/, ""),
        alt_text: file.name.replace(/\.[^.]+$/, ""),
        image_url: data.publicUrl,
        storage_path: filename,
        bucket,
        is_active: true,
      });
    }
    return NextResponse.json({ url: data.publicUrl });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
