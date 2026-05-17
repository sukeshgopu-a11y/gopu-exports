import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, default: "" },
    description: { type: String, default: "" },
    origin: { type: String, default: "" },
    moq: { type: String, default: "" },
    packaging: { type: String, default: "" },
    lead: { type: String, default: "" },
    hs: { type: String, default: "" },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
