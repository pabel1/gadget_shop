/* eslint-disable node/no-extraneous-require */
const express = require("express");
const FileUploadHelper = require("../../../Middleware/uploadMiddleware");
const validateRequest = require("../../../Middleware/validateRequest");
const JoiProductValidationSchema = require("./product.validation");
const productController = require("./product.controller");

const router = express.Router();

router.post(
  "/create",
  FileUploadHelper.upload.single("image"),
  // validateRequest(JoiProductValidationSchema.createProductValidationSchema),
  productController.createProduct
);

const productRouter = router;

module.exports = productRouter;
