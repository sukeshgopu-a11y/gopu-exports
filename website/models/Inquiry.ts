import mongoose from "mongoose";

const InquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    company: { type: String },
    email: { type: String, required: true },
    phone: { type: String },
    country: { type: String },
    port: { type: String },
    product: { type: String },
    quantity: { type: String },
    frequency: { type: String },
    incoterm: { type: String },
    notes: { type: String },
    status: {
      type: String,
      enum: ["New", "Pending", "Replied", "Closed"],
      default: "New",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Inquiry ||
  mongoose.model("Inquiry", InquirySchema);
