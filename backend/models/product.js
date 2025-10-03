const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productCode: { type: String, required: true },
    name: { type: String, required: true },
    description: String,
    category: { type: String, required: true },
    subcategory: { type: String, required: true },
    brand: { type: String, required: true },
    price: { type: String, required: true },
    stock: { type: Number, default: 0 },
    images: [{ url: String, filename: String }],
    features: [String],
    notes: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
