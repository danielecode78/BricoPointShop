require("dotenv").config({ path: "../.env" });
const { Category, Brand } = require("../models/seedsSchemas");
const mongoose = require("mongoose");

const seedDatabase = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error:"));
  db.once("open", () => {
    console.log("Database connesso");
  });

  await Category.deleteMany({});
  await Brand.deleteMany({});

  await Category.insertMany([
    {
      name: "Fai da te",
      subcategories: [
        { name: "Elettroutensili" },
        { name: "Utensili manuali" },
        { name: "Ferramenta" },
        { name: "Materiali da costruzione" },
      ],
    },
    {
      name: "Casa",
      subcategories: [
        { name: "Illuminazione" },
        { name: "Colori e vernici" },
        { name: "Pavimenti e rivestimenti" },
        { name: "Arredo bagno" },
        { name: "Arredo cucina" },
      ],
    },
    {
      name: "Giardino",
      subcategories: [
        { name: "Mobili da giardino" },
        { name: "Barbecue" },
        { name: "Casette e serre" },
        { name: "Macchine da giardino" },
        { name: "Piante e semi" },
      ],
    },
    {
      name: "Bagno",
      subcategories: [
        { name: "Mobili bagno" },
        { name: "Sanitari" },
        { name: "Docce e rubinetteria" },
        { name: "Accessori bagno" },
      ],
    },
    {
      name: "Cucina",
      subcategories: [
        { name: "Mobili cucina" },
        { name: "Rubinetti e miscelatori" },
        { name: "Cappe e accessori" },
      ],
    },
    {
      name: "Clima e riscaldamento",
      subcategories: [
        { name: "Stufe e camini" },
        { name: "Climatizzatori" },
        { name: "Ventilatori" },
        { name: "Deumidificatori" },
      ],
    },
    {
      name: "Garage e auto",
      subcategories: [
        { name: "Batterie auto" },
        { name: "Accessori garage" },
        { name: "Tettoie e coperture" },
      ],
    },
    {
      name: "Pulizia e organizzazione",
      subcategories: [
        { name: "Bidoni aspiratutto" },
        { name: "Detergenti e disincrostanti" },
        { name: "Scaffali e contenitori" },
      ],
    },
  ]);

  await Brand.insertMany([
    { name: "Vortek Tools" },
    { name: "GreenForge" },
    { name: "ThermoLux" },
    { name: "Coloria" },
    { name: "Gardenova" },
    { name: "Fixon" },
    { name: "Hydrovent" },
    { name: "LuminaCraft" },
    { name: "Brickform" },
    { name: "Sanitec" },
    { name: "CucinaPro" },
    { name: "AutoShield" },
    { name: "Cleanova" },
    { name: "DecoStyle" },
    { name: "PowerNest" },
  ]);

  console.log("Database creato!");
  mongoose.disconnect();
};

seedDatabase();
