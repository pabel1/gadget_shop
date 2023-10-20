/* eslint-disable node/no-extraneous-require */
const express = require("express");

const router = express.Router();

// router.post(
//   "/create",
//   FileUploadHelper.upload.single("image"),
//   validateRequest(JoiCategoriesValidationSchema.categoriesValidationSchema),
//   categoriesController.createCategories
// );

const subCategoriesRouter = router;

module.exports = subCategoriesRouter;
