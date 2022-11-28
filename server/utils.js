const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const stockCheck = async (editedCart) => {
  const client = new MongoClient(MONGO_URI);
  const cartIds = editedCart.map((product) => {
    return product._id;
  });

  const db = client.db("group-project");
  const result = await db
    .collection("items")
    .find({
      _id: {
        $in: [...cartIds],
      },
    })
    .toArray();

  const problemStocks = [];
  result.map((product, index) => {
    product.numInStock < Math.abs(editedCart[index].quantity) &&
      problemStocks.push(editedCart[index]._id);
  });

  return problemStocks;
};

// In order to filter the products by price, add an integer price key to the product
const addIntPriceKey = (array) => {
  const newArray = array.map((product) => {
    return {
      ...product,
      intPrice: parseFloat(product.price.replace(/["$,]/g, "")),
    };
  });
  return newArray;
};
module.exports = { stockCheck, addIntPriceKey };
