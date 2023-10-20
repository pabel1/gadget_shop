/* eslint-disable node/no-extraneous-require */
const express = require("express");
const FileUploadHelper = require("../../../Middleware/uploadMiddleware");
const validateRequest = require("../../../Middleware/validateRequest");
const JoiSubCategoriesValidationSchema = require("./subCategories.validation");
const subCategoriesController = require("./subCategories.controller");

const router = express.Router();

router.post(
  "/create",
  FileUploadHelper.upload.single("image"),
  validateRequest(
    JoiSubCategoriesValidationSchema.createSubCategoriesValidationSchema
  ),
  subCategoriesController.createSubCategories
);

const subCategoriesRouter = router;

module.exports = subCategoriesRouter;
