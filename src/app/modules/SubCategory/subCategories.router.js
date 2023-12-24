/* eslint-disable node/no-extraneous-require */
const express = require("express");
const FileUploadHelper = require("../../../Middleware/uploadMiddleware");
const validateRequest = require("../../../Middleware/validateRequest");
const JoiSubCategoriesValidationSchema = require("./subCategories.validation");
const subCategoriesController = require("./subCategories.controller");
const authVerification = require("../../../Middleware/authVarification");
const { UploadImageCloudinary } = require("../../../Middleware/upload");

const router = express.Router();

router.post(
  "/create",
  // authVerification,
  UploadImageCloudinary.single("subcategory_image"),
  validateRequest(
    JoiSubCategoriesValidationSchema.createSubCategoriesValidationSchema
  ),
  subCategoriesController.createSubCategories
);

router.get("/get-all", subCategoriesController.getAllSubCategoriesFromDB);

const subCategoriesRouter = router;

module.exports = subCategoriesRouter;
