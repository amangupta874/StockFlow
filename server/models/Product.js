import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Product title is required"],
      trim: true,
      maxlength: 120
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1200,
      default: ""
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      maxlength: 80
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: 0
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: 0,
      default: 0
    },
    image: {
      type: String,
      default: ""
    },
    imagePublicId: {
      type: String,
      default: ""
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    }
  },
  { timestamps: true }
);

productSchema.index({ title: "text", category: "text" });

const Product = mongoose.model("Product", productSchema);

export default Product;
