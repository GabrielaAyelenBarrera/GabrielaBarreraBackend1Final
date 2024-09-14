import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";
const { Schema } = mongoose;

const productSchema = new Schema(
  {
    id: { type: Number, unique: true },
    title: String,
    description: String,
    code: String,
    price: Number,
    status: Boolean,
    stock: Number,
    category: String,
    thumbnails: [String],
  },
  { timestamps: true }
);
productSchema.plugin(paginate);
const Product = mongoose.model("Product", productSchema);

export default Product;
