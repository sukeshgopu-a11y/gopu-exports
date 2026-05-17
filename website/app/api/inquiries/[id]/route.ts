import { connectDB } from "@/lib/mongodb";
import Inquiry from "@/models/Inquiry";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const { id } = await params;
  const body = await req.json();
  const inquiry = await Inquiry.findByIdAndUpdate(id, body, { new: true });
  if (!inquiry)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(inquiry);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const { id } = await params;
  await Inquiry.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
