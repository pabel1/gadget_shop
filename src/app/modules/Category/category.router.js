/* eslint-disable node/no-extraneous-require */
const express = require("express");
const FileUploadHelper = require("../../../Middleware/uploadMiddleware");
const validateRequest = require("../../../Middleware/validateRequest");
const JoiCategoriesValidationSchema = require("./categories.validation");
const categoriesController = require("./category.controller");

const router = express.Router();

router.post(
  "/create",
  FileUploadHelper.upload.single("image"),
  validateRequest(JoiCategoriesValidationSchema.categoriesValidationSchema),
  categoriesController.createCategories
);

const categoriesRouter = router;

module.exports = categoriesRouter;
