/* eslint-disable node/no-extraneous-require */
const express = require("express");
const productController = require("./product.controller");
const { UploadImageCloudinary } = require("../../../Middleware/upload");
const router = express.Router();

router.post(
  "/create",
  // UploadImageCloudinary.fields(
  //   imageUploadFields.map((item) => ({ name: item, maxCount: 20 }))
  // ),

  UploadImageCloudinary.fields([{ name: "product_image", maxCount: 10 }]),
  productController.createProduct
);

const productRouter = router;

module.exports = productRouter;
