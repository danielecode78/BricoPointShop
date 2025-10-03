const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    shippingData: {
      firstName: String,
      lastName: String,
      street: String,
      city: String,
      zip: String,
      phone: String,
      notes: String,
    },
    items: [],
    shippingCost: Number,
    totalPrice: Number,
    status: {
      type: String,
      enum: [
        "in_attesa",
        "in_preparazione",
        "spedito",
        "consegnato",
        "annullato",
      ],
      default: "in_attesa",
    },

    paymentMethod: {
      type: String,
      default: "contrassegno",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
