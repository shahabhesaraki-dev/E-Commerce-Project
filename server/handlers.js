"use strict";
const { MongoClient } = require("mongodb");
const { stockCheck, addIntPriceKey } = require("./utils");
require("dotenv").config();
const { MONGO_URI } = process.env;

const getProducts = async (req, res) => {
  const client = new MongoClient(MONGO_URI);
  try {
    await client.connect();
    const db = client.db("group-project");
    const result = await db.collection("items").find().toArray();
    client.close();

    result.length > 0
      ? res.status(200).json({
          status: 200,
          data: result,
          message: `All products are loaded!`,
        })
      : res.status(404).json({
          status: 404,
          message: `Couldn't find any product!`,
        });
  } catch (err) {
    console.log("Error: ", err);
  }
};

const getProduct = async (req, res) => {
  const productId = parseInt(req.params.id);
  const client = new MongoClient(MONGO_URI);
  try {
    await client.connect();
    const db = client.db("group-project");
    const resultItem = await db.collection("items").findOne({ _id: productId });
    client.close();

    resultItem
      ? res.status(200).json({
          status: 200,
          data: resultItem,
          message: `Item found!`,
        })
      : res.status(404).json({
          status: 404,
          data: `_id: ${productId}`,
          message: `Couldn't find the item!`,
        });
  } catch (err) {
    console.log("Error: ", err);
  }
};

const getCategories = async (req, res) => {
  const client = new MongoClient(MONGO_URI);
  try {
    await client.connect();
    const db = client.db("group-project");
    const result = await db
      .collection("items")
      .find({})
      .project({ category: 1 })
      .toArray();
    client.close();

    // Collect all the categories from result
    const allCategoriesFromResult = result.map((item) => {
      return item.category;
    });

    // Filter repeated categories
    const uniqueCategories = [...new Set(allCategoriesFromResult)];

    result.length > 0
      ? res.status(200).json({
          status: 200,
          data: uniqueCategories,
          message: `Categories loaded!`,
        })
      : res.status(404).json({
          status: 404,
          message: `Couldn't find any category!`,
        });
  } catch (err) {
    console.log("Error: ", err);
  }
};

const getRecommendedProducts = async (req, res) => {
  const MAX_ITEM = 20;
  const LIMIT = 4;
  const client = new MongoClient(MONGO_URI);
  try {
    await client.connect();
    const db = client.db("group-project");
    const result = await db
      .collection("items")
      .find()
      // Sort all items by stock num descending, {numInStock: 1} would be ascending
      .sort({ numInStock: -1 })
      .toArray();
    client.close();

    // Slice the array by maximum item number - which is 20 now
    const highestStockItems = result.slice(0, MAX_ITEM);

    // Shuffle array order, in order to make the selection random
    const shuffled = highestStockItems.sort(() => 0.5 - Math.random());

    // Slice shuffled array by given limit - which is 4 now
    const recomendedProducts = shuffled.slice(0, LIMIT);

    result.length > 0
      ? res.status(200).json({
          status: 200,
          data: recomendedProducts,
          message: `Recommended products are loaded!`,
        })
      : res.status(404).json({
          status: 404,
          message: `Couldn't find any product!`,
        });
  } catch (err) {
    console.log("Error: ", err);
  }
};

const getSaleProducts = async (req, res) => {
  // This handler returns random 4 out of 20 lowest stock items
  const MAX_ITEM = 20;
  const LIMIT = 4;
  const client = new MongoClient(MONGO_URI);
  try {
    await client.connect();
    const db = client.db("group-project");
    const result = await db
      .collection("items")
      // Find the items more than 0 stock
      .find({ numInStock: { $gt: 0 } })
      // Sort all items by stock num ascending, {numInStock: -1} would be decending
      .sort({ numInStock: 1 })
      .toArray();
    client.close();

    // Slice the array by maximum item number - which is 20 now
    const lowestStockItems = result.slice(0, MAX_ITEM);

    // Applying discount to 20 lowest stock items
    const allSaleProducts = lowestStockItems.map((product) => {
      return {
        ...product,
        salePrice:
          // In here we need a discounted price with $ but since price is a string with $ and "",
          // you can not do any calculation with it. So I cleaned the string with replace method
          // and convert it to float, in the end, I limited the decimal numbers

          "$" +
          parseFloat(product.price.replace(/["$,]/g, "") * 0.85).toFixed(2),
      };
    });

    // Shuffle the allSaleProducts array order, in order to make the selection random
    const shuffledAllProducts = allSaleProducts.sort(() => 0.5 - Math.random());

    // Slice shuffled array by given limit - which is 4 now and map it, in order to add a sale price to the product
    const saleProducts = shuffledAllProducts.slice(0, LIMIT);

    result.length > 0
      ? res.status(200).json({
          status: 200,
          data: {
            saleProducts: saleProducts,
            allSaleProducts: allSaleProducts,
          },
          message: `Sale products are loaded!`,
        })
      : res.status(404).json({
          status: 404,
          message: `Couldn't find any product!`,
        });
  } catch (err) {
    console.log("Error: ", err);
  }
};

const getPopularProducts = async (req, res) => {
  // This handler returns random 4 out of 10 most expensive items
  const MAX_ITEM = 10;
  const LIMIT = 4;
  const client = new MongoClient(MONGO_URI);
  try {
    await client.connect();
    const db = client.db("group-project");
    const result = await db.collection("items").find().toArray();
    client.close();

    // Since the price value is a string, we cannot sort products by their prices.
    // I added a new key that takes the price value, cleans the data and makes it float. Not int because most of the items has decimal
    const editedResult = result.map((product) => {
      return {
        ...product,
        intPrice: parseFloat(product.price.replace(/["$,]/g, "")),
      };
    });

    // Now we can sort the products with our new intPrice key, high to low.
    const sortedResult = editedResult.sort((a, b) => b.intPrice - a.intPrice);

    // Slice the array by maximum item number - which is 10
    const mostExpensiveItems = sortedResult.slice(0, MAX_ITEM);

    // Shuffle array order, in order to make the selection random
    const shuffled = mostExpensiveItems.sort(() => 0.5 - Math.random());

    // Slice shuffled array by given limit - which is 4
    const popularProducts = shuffled.slice(0, LIMIT);

    result.length > 0
      ? res.status(200).json({
          status: 200,
          data: popularProducts,
          message: `Popular products are loaded!`,
        })
      : res.status(404).json({
          status: 404,
          message: `Couldn't find any product!`,
        });
  } catch (err) {
    console.log("Error: ", err);
  }
};

const updateStock = async (req, res) => {
  const { cart } = req.body;
  const editedCart = cart.map((item) => {
    return { ...item, quantity: -item.selectedItem };
  });
  const client = new MongoClient(MONGO_URI);

  try {
    // Mongodb bulkUpdate needs an array to update multiple items.
    // Every item has its updateOne method, id as filter and quantity as increase
    const bulkUpdate =
      // stokCheck is a func that checks if product has enough stock for fulfilling the order,
      // func returns product ids that have stock problem
      (await stockCheck(editedCart)).length === 0 && editedCart
        ? editedCart.map((product) => {
            return {
              updateOne: {
                filter: {
                  _id: product._id,
                  // numInStock: { $gte: Math.abs(product.quantity) },
                },
                update: { $inc: { numInStock: product.quantity } },
              },
            };
          })
        : res.status(404).json({
            status: 404,
            data: await stockCheck(editedCart),
            message: `One or more products dont have enough stock!`,
          });

    await client.connect();
    const db = client.db("group-project");
    const result = await db.collection("items").bulkWrite(bulkUpdate);

    client.close();

    //If modified documents number is not equal to cart length,
    // that means one or more items stock is not enough
    result.nModified === cart.length
      ? res.status(200).json({
          status: 200,
          message: `Item's stock updated!`,
        })
      : res.status(404).json({
          status: 404,
          message: `Couldnt find any products!`,
        });
  } catch (err) {
    console.log("Error: ", err);
  }
};

const getSeller = async (req, res) => {
  const sellerId = parseInt(req.params.id);
  const client = new MongoClient(MONGO_URI);
  try {
    await client.connect();
    const db = client.db("group-project");
    const result = await db.collection("companies").findOne({ _id: sellerId });
    client.close();

    result
      ? res.status(200).json({
          status: 200,
          data: result,
          message: `Seller found!`,
        })
      : res.status(404).json({
          status: 404,
          data: `_id: ${sellerId}`,
          message: `Couldn't find any seller!`,
        });
  } catch (err) {
    console.log("Error: ", err);
  }
};

const findProducts = async (req, res) => {
  const query = req.params.query;
  const client = new MongoClient(MONGO_URI);
  try {
    await client.connect();
    const db = client.db("group-project");
    const result = await db
      .collection("items")
      // Find the items which their name includes the search term(query), "options i" is for case insensitivity
      .find({ name: { $regex: query, $options: "i" } })
      .toArray();

    client.close();

    const editedResult = result.length > 0 && addIntPriceKey(result);

    result.length > 0
      ? res.status(200).json({
          status: 200,
          data: editedResult,
          message: `Products found!`,
        })
      : res.status(404).json({
          status: 404,
          data: `search term: ${query}`,
          message: `Couldn't find any product!`,
        });
  } catch (err) {
    console.log("Error: ", err);
  }
};

const getProductsFromIds = async (req, res) => {
  const { productIds } = req.body;
  const intIds = productIds.map((id) => {
    return parseInt(id);
  });

  const client = new MongoClient(MONGO_URI);
  try {
    await client.connect();
    const db = client.db("group-project");
    const result = await db
      .collection("items")
      .find({
        _id: {
          $in: [...intIds],
        },
      })
      .toArray();
    client.close();

    // const editedResult = result.map((item) => {
    //   return { ...item, _id: item._id.toString() };
    // });

    result.length > 0
      ? res.status(200).json({
          status: 200,
          data: result,
          message: `Products found!`,
        })
      : res.status(404).json({
          status: 404,
          data: productIds,
          message: `Couldn't find any product!`,
        });
  } catch (err) {
    console.log("Error: ", err);
  }
};

module.exports = {
  getProducts,
  getProduct,
  getCategories,
  getRecommendedProducts,
  getSaleProducts,
  getPopularProducts,
  updateStock,
  getSeller,
  findProducts,
  getProductsFromIds,
};
