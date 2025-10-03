const Joi = require("joi");

const productSchema = Joi.object({
  productCode: Joi.string().trim().required(),
  name: Joi.string().trim().required(),
  description: Joi.string().allow("").optional(),
  category: Joi.string().trim().required(),
  subcategory: Joi.string().trim().required(),
  brand: Joi.string().trim().required(),
  price: Joi.string()
    .trim()
    .pattern(/^\d+(,\d{1,2})?$/)
    .required(),
  stock: Joi.number().integer().min(0).default(0),
  images: Joi.array()
    .items(
      Joi.object({
        url: Joi.string().uri().required(),
        filename: Joi.string().required(),
      })
    )
    .optional(),
  features: Joi.array().items(Joi.string()).optional(),
  notes: Joi.string().allow("").optional(),
});

const objectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/);
const userSchema = Joi.object({
  username: Joi.string().trim().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("user", "admin").default("user"),
  email: Joi.string().email().required(),
  firstName: Joi.string().allow("").optional(),
  lastName: Joi.string().allow("").optional(),
  phone: Joi.string().allow("").optional(),
  addressToSend: Joi.object({
    street: Joi.string().allow("").optional(),
    city: Joi.string().allow("").optional(),
    zip: Joi.string().allow("").optional(),
  }).optional(),
  addressLegal: Joi.object({
    street: Joi.string().allow("").optional(),
    city: Joi.string().allow("").optional(),
    zip: Joi.string().allow("").optional(),
  }).optional(),
  cart: Joi.array()
    .items(
      Joi.object({
        productId: objectId.required(),
        quantity: Joi.number().integer().min(1).default(1),
      })
    )
    .optional(),
  orders: Joi.array().items(objectId).optional(),
});

const orderSchema = Joi.object({
  user: objectId.required(),

  shippingAddress: Joi.object({
    fullName: Joi.string().required(),
    street: Joi.string().required(),
    city: Joi.string().required(),
    zip: Joi.string().required(),
    country: Joi.string().required(),
    phone: Joi.string().required(),
  }).required(),

  items: Joi.array()
    .items(
      Joi.object({
        productId: objectId.required(),
        name: Joi.string().required(),
        brand: Joi.string().required(),
        category: Joi.string().required(),
        subcategory: Joi.string().required(),
        price: Joi.number().min(0).required(),
        quantity: Joi.number().integer().min(1).required(),
      })
    )
    .min(1)
    .required(),

  shippingCost: Joi.number().min(0).required(),

  totalPrice: Joi.number().min(0),

  status: Joi.string()
    .valid("in_attesa", "spedito", "consegnato", "annullato")
    .default("in_attesa"),

  paymentMethod: Joi.string().default("contrassegno"),

  paymentStatus: Joi.string().valid("in_attesa", "pagato").default("in_attesa"),
});

module.exports = {
  productSchema,
  userSchema,
  orderSchema,
};
