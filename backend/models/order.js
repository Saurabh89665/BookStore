const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true,
    },
    book: {
      type: mongoose.Types.ObjectId,
      ref: "book",
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: "Placed",
      enum: ["Placed", "Out for Delivery", "Delivered", "Canceled"],
    },
    paymentMode: {
      type: String,
      default: "Cash on Delivery",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("order", orderSchema);
