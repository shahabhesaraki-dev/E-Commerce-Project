const companies = require("./data/companies.json");
const items = require("./data/items.json");

const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const batchImport = async () => {
  const client = new MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("group-project");

  const resultItems = await db.collection("items").insertMany(items);
  const resultCompanies = await db
    .collection("companies")
    .insertMany(companies);

  // if both inserting attempts are succesfull or not, log it
  resultItems && resultCompanies
    ? console.log("Data imported successfully! ")
    : console.log("ERROR!");

  client.close();
};

batchImport();
