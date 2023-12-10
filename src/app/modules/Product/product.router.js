/* eslint-disable node/no-extraneous-require */
const express = require("express");
const FileUploadHelper = require("../../../Middleware/uploadMiddleware");
const validateRequest = require("../../../Middleware/validateRequest");
const JoiProductValidationSchema = require("./product.validation");
const productController = require("./product.controller");
const { UploadImageCloudinary } = require("../../../Middleware/upload");

const router = express.Router();

router.post(
  "/create",
  // UploadImageCloudinary.fields(
  //   imageUploadFields.map((item) => ({ name: item, maxCount: 20 }))
  // ),
  UploadImageCloudinary.array("product_image", 20),
  validateRequest(JoiProductValidationSchema.createProductValidationSchema),
  productController.createProduct
);

const productRouter = router;

module.exports = productRouter;
