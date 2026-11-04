const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Name is required"], trim: true },
    description: { type: String, trim: true, default: "" },
    price: { type: Number, required: [true, "Price is required"], min: 0 },
    category: { type: String, trim: true, default: "general" },
    image: { type: String, trim: true, default: "" },
    stock: { type: Number, required: true, min: 0, default: 0 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);