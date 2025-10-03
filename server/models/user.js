const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new Schema(
  {
    role: { type: String, enum: ["user", "admin"], default: "user" },
    email: { type: String, required: true, unique: true },
    firstName: String,
    lastName: String,
    phone: String,
    addressToSend: {
      street: String,
      city: String,
      zip: String,
    },
    addressLegal: {
      street: String,
      city: String,
      zip: String,
    },
    cart: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, default: 1 },
      },
    ],
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
  },
  { timestamps: true }
);

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
