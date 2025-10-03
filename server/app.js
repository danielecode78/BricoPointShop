// -------------------- DOTENV
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
console.log(
  `AMBIENTE: ${
    process.env.NODE_ENV === "production" ? "PRODUZIONE" : "SVILUPPO"
  }`
);

// -------------------- Express
const express = require("express");
const app = express();

// -------------------- Json
app.use(express.json());

// -------------------- Mongoose
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Errore di connessione:"));
db.once("open", () => {
  console.log("Database connesso");
});
const { Category, Brand } = require("./models/seedsSchemas");
const Product = require("./models/product");
const User = require("./models/user");
const Order = require("./models/order");

// -------------------- Cors
// const cors = require("cors");

// if (process.env.NODE_ENV !== "production") {
//   app.use(
//     cors({
//       origin: "http://localhost:5173",
//       credentials: true,
//     })
//   );
// }

// // -------------------- Helmet
const helmet = require("helmet");
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: [
          "'self'",
          "http://localhost:3000",
          "http://localhost:5173",
        ],
        imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        fontSrc: ["'self'", "data:", "https://fonts.gstatic.com"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
  })
);

// // -------------------- Hpp
const hpp = require("hpp");
app.use(hpp());

// -------------------- Express Rate Limit
const rateLimit = require("express-rate-limit");
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Troppi tentativi, riprova più tardi" },
});

// -------------------- Express Mongo Sanitize
const mongoSanitize = require("express-mongo-sanitize");
const safeSanitize = (req, res, next) => {
  mongoSanitize.sanitize(req.body);
  mongoSanitize.sanitize(req.query);
  mongoSanitize.sanitize(req.params);
  next();
};
app.use(safeSanitize);

// -------------------- Express Session / Connect Mongo
const session = require("express-session");
const connectMongo = require("connect-mongo");
const timeLogin = 1000 * 60 * 60 * 24 * 7;
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: connectMongo.create({
      mongoUrl: process.env.MONGO_URI,
      ttl: timeLogin,
    }),
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "none",
      maxAge: timeLogin,
    },
  })
);

// -------------------- Passport / Passport Local
const passport = require("passport");
const LocalStrategy = require("passport-local");
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// -------------------- IsLoggedIn
const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Devi essere loggato per accedere" });
  }
  next();
};

// -------------------- isAdmin
const isAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    const err = new Error("Accesso negato");
    err.statusCode = 403;
    return next(err);
  }
  next();
};

// -------------------- CatchAsync
const catchAsync = (func) => {
  return (req, res, next) => {
    func(req, res, next).catch(next);
  };
};

// -------------------- Multer / Cloudinary
const { storage, cloudinary } = require("./utilities/cloudinary");
const multer = require("multer");
const upload = multer({ storage });

// -------------------- Validation / Joi
const {
  productSchema,
  userSchema,
  orderSchema,
} = require("./utilities/validationJoi");
const { LoremModule } = require("@faker-js/faker");
const validateBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((err) => ({
        field: err.path[0],
        message: err.message,
      }));
      return res.status(400).json({ errors });
    }
    next();
  };
};

// -------------------- Node Cron
const cron = require("node-cron");
function scheduleOrder(id) {
  const task = cron.schedule("* * * * *", async () => {
    const order = await Order.findById(id);
    if (!order) return;

    const status = order.status;

    switch (status) {
      case "annullato":
        task.stop();
        return;
      case "in_attesa":
        order.status = "in_preparazione";
        await order.save();
        break;
      case "in_preparazione":
        order.status = "spedito";
        await order.save();
        break;
      case "spedito":
        order.status = "consegnato";
        await order.save();
        task.stop();
        break;
    }
  });
}

// -------------------- Routes

app.get("/loggedIn", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.sendStatus(200);
  }
});

app.get(
  "/products",
  catchAsync(async (req, res) => {
    const { search, subcategory } = req.query;
    if (search) {
      const escapeRegex = (str) => str.replace(/[-[\]/{}()*+?.\\^$|]/g, "\\$&");
      const searchRegex = new RegExp(escapeRegex(search), "i");
      const products = await Product.find({
        $or: [
          { name: searchRegex },
          { description: searchRegex },
          { brand: searchRegex },
        ],
      });
      res.json(products);
    } else {
      const query = subcategory ? { subcategory } : {};
      const products = await Product.find(query);
      res.json(products);
    }
  })
);

app.get(
  "/categories",
  catchAsync(async (req, res) => {
    const categories = await Category.find({});
    res.json(categories);
  })
);

app.get(
  "/brands",
  catchAsync(async (req, res) => {
    const brands = await Brand.find({});
    res.json(brands);
  })
);

app.get(
  "/cart",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const userCart = await User.findById(req.user._id).populate(
      "cart.productId"
    );
    res.json(userCart.cart);
  })
);

app.get(
  "/user",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const user = await User.findById(req.user._id).populate("cart.productId");
    res.json(user);
  })
);

app.get(
  "/orders",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const user = await User.findById(req.user._id).populate("orders");
    const orders = user.orders;
    res.json(orders);
  })
);

app.patch(
  "/cart",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: { cart: req.body },
      },
      { new: true }
    );
    res.json(user);
  })
);

app.get(
  "/product/:id",
  catchAsync(async (req, res) => {
    const product = await Product.findById(req.params.id);
    res.json(product);
  })
);

app.delete(
  "/product/:id",
  isLoggedIn,
  isAdmin,
  catchAsync(async (req, res) => {
    const productDeleted = await Product.findByIdAndDelete(req.params.id);
    for (let image of productDeleted.images) {
      await cloudinary.uploader.destroy(image.filename);
    }
    res.sendStatus(200);
  })
);

app.put(
  "/product/:id/edit",
  isLoggedIn,
  isAdmin,
  validateBody(productSchema),
  upload.array("images"),
  catchAsync(async (req, res) => {
    const featuresArray = JSON.parse(req.body.features);
    const oldImages = JSON.parse(req.body.oldImages);
    const newPrice = req.body.price.replace(".", ",");
    const newProduct = await Product.findByIdAndUpdate(req.params.id, {
      ...req.body,
      price: newPrice,
      features: featuresArray,
    });
    const imagesToDelete = newProduct.images.filter(
      (el) => !oldImages.some((img) => img.filename === el.filename)
    );
    newProduct.images = [...oldImages];
    const newImages = req.files.map((el) => ({
      url: el.path,
      filename: el.filename,
    }));
    newProduct.images.push(...newImages);
    await newProduct.save();
    for (let image of imagesToDelete) {
      await cloudinary.uploader.destroy(image.filename);
    }
    res.sendStatus(200);
  })
);

app.post(
  "/products",
  isLoggedIn,
  isAdmin,
  validateBody(productSchema),
  upload.array("images"),
  catchAsync(async (req, res) => {
    const featuresArray = JSON.parse(req.body.features);
    const newPrice = req.body.price.replace(".", ",");
    const newProduct = new Product({
      ...req.body,
      price: newPrice,
      features: featuresArray,
    });
    newProduct.images = req.files.map((el) => ({
      url: el.path,
      filename: el.filename,
    }));
    await newProduct.save();
    res.sendStatus(200);
  })
);

// app.post(
//   "/register",
//   validateBody(userSchema),
//   catchAsync(async (req, res) => {
//     const { password, ...data } = req.body;
//     const newUser = new User(data);
//     await User.register(newUser, password);
//     req.login(newUser, (err) => {
//       if (err) return next(err);
//       res.json({ user: newUser });
//     });
//   })
// );

app.post("/login", authLimiter, (req, res) => {
  passport.authenticate("local", (err, user, info) => {
    if (!user) {
      let field;
      return res.status(401).json({
        errors: [{ field: "form", message: "Credenziali di accesso errate" }],
      });
    }

    req.login(user, (err) => {
      if (err) return res.status(500).json({ error: "Errore login" });
      req.session.save(() => {
        res.json({ user });
      });
    });
  })(req, res);
});

app.post("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);
    res.sendStatus(200);
  });
});

app.post(
  "/addToCart",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { productId, quantity } = req.body;
    const thisUser = await User.findById(req.user._id);

    const item = thisUser.cart.find((el) => el.productId.equals(productId));

    if (!item) {
      thisUser.cart.push({ productId, quantity });
    } else {
      item.quantity += quantity;
    }

    await thisUser.save();
    res.json({ user: thisUser });
  })
);

app.post(
  "/order",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const newOrder = new Order(req.body);
    await newOrder.save();
    const newUser = await User.findByIdAndUpdate(
      req.user._id,
      { $push: { orders: newOrder._id } },
      { new: true }
    );
    scheduleOrder(newOrder._id);
    res.sendStatus(200);
  })
);

app.patch(
  "/order",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const id = req.body.orderId;
    const order = await Order.findByIdAndUpdate(
      id,
      {
        $set: { status: "annullato" },
      },
      { new: true }
    );
    res.sendStatus(200);
  })
);

// -------------------- Server side
const path = require("path");
app.use(express.static(path.join(__dirname, "../client/dist")));

app.use((req, res, next) => {
  if (req.method === "GET" && !req.path.startsWith("/api")) {
    res.sendFile(path.join(__dirname, "../client/dist/index.html"));
  } else {
    next();
  }
});

// -------------------- ErrorHandler

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Ops, qualcosa è andato storto!!!";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

app.listen(3000, () => {
  console.log("Il server è in ascolto sulla porta 3000");
});
