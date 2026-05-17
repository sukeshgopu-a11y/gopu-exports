import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const products = await Product.find().sort({ createdAt: -1 });
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();

  if (!body.title || !body.category) {
    return NextResponse.json(
      { error: "title and category are required" },
      { status: 400 }
    );
  }

  const slug =
    body.slug ||
    body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const product = await Product.create({ ...body, slug });
  return NextResponse.json(product, { status: 201 });
}
