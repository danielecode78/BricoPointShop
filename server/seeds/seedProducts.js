require("dotenv").config({ path: "../.env" });
const mongoose = require("mongoose");
const { Category, Brand } = require("../models/seedsSchemas");
const Product = require("../models/product");
const { faker } = require("@faker-js/faker");

const seedProducts = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error:"));
  db.once("open", () => {
    console.log("✅ Database connesso");
  });

  await Product.deleteMany({});
  console.log("🧹 Prodotti precedenti rimossi");

  const categories = await Category.find({});
  const brands = await Brand.find({});

  if (!categories.length || !brands.length) {
    console.error(
      "❌ Nessuna categoria o brand trovati. Assicurati di aver eseguito il seed iniziale."
    );
    return mongoose.disconnect();
  }

  const products = [];

  for (let i = 0; i < 100; i++) {
    const category = faker.helpers.arrayElement(categories);
    const subcategory = faker.helpers.arrayElement(category.subcategories);
    const brand = faker.helpers.arrayElement(brands);

    products.push({
      productCode: faker.string.uuid(),
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      category: category.name,
      subcategory: subcategory.name,
      brand: brand.name,
      price: faker.commerce.price({ min: 10, max: 500, dec: 2 }),
      stock: faker.number.int({ min: 0, max: 100 }),
      images: [
        {
          url: faker.image.urlPicsumPhotos(),
          filename: faker.system.fileName(),
        },
      ],
      features: [
        faker.commerce.productAdjective(),
        faker.helpers.arrayElement([
          "Acciaio",
          "Plastica",
          "Legno",
          "Alluminio",
          "Vetro",
          "Ceramica",
        ]),
        faker.color.human(),
      ],
      notes: faker.lorem.sentence(),
    });
  }

  await Product.insertMany(products);
  console.log("✅ 100 prodotti inseriti con successo!");
  mongoose.disconnect();
};

seedProducts();
