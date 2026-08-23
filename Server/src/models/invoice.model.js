import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: [true, "Please add product name"],
  },
  productQuantity: {
    type: Number,
  },
  unitPrice: {
    type: Number,
  },
  totalPrice: {
    type: Number,
  },
});

const invoiceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    imageUrl: {
      type: String,
      required: [true, "Please add Img"],
    },
    invoiceNumber: {
      type: String,
    },
    invoiceName: {
      type: String,
      required: [true, "Please add invoice name"],
    },
    totalAmount: {
      type: Number,
      required: [true, "Please add total amount"],
    },
    invoiceDate: {
      type: Date,
    },
    productList: [productSchema],
  },
  {
    timestamps: true,
  }
);

export const Invoice = mongoose.model("Invoice", invoiceSchema);
