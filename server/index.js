"use strict";

const express = require("express");
const morgan = require("morgan");

const PORT = 4000;

const {
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
} = require("./handlers");

express()
  .use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Methods",
      "OPTIONS, HEAD, GET, PUT, POST, DELETE"
    );
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  })
  .use(morgan("tiny"))
  .use(express.static("./server/assets"))
  .use(express.json())
  .use(express.urlencoded({ extended: false }))
  .use("/", express.static(__dirname + "/"))

  /// REST endpoints
  .get("/api/get-products", getProducts)
  .get("/api/get-product/:id", getProduct)
  .get("/api/get-categories", getCategories)
  .get("/api/get-recommended-products", getRecommendedProducts)
  .get("/api/get-sale-products", getSaleProducts)
  .get("/api/get-popular-products", getPopularProducts)
  .get("/api/get-seller/:id", getSeller)
  .get("/api/find-products/:query", findProducts)
  .post("/api/get-products-from-ids", getProductsFromIds)

  .patch("/api/update-stock", updateStock)

  .listen(PORT, () => console.info(`Listening on port ${PORT}`));
