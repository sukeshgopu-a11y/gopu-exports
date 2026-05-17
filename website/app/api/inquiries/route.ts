import { connectDB } from "@/lib/mongodb";
import Inquiry from "@/models/Inquiry";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const inquiries = await Inquiry.find().sort({ createdAt: -1 });
  return NextResponse.json(inquiries);
}

export async function POST(req: Request) {
  await connectDB();

  const body = await req.json();

  const required = ["name", "email"];
  for (const field of required) {
    if (!body[field]) {
      return NextResponse.json(
        { error: `${field} is required` },
        { status: 400 }
      );
    }
  }

  const inquiry = await Inquiry.create({
    name: body.name,
    company: body.company,
    email: body.email,
    phone: body.phone,
    country: body.country,
    port: body.port,
    product: body.product,
    quantity: body.quantity,
    frequency: body.frequency,
    incoterm: body.incoterm,
    notes: body.notes,
  });

  return NextResponse.json(inquiry, { status: 201 });
}
