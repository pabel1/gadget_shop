/* eslint-disable node/no-extraneous-require */
const express = require("express");

const categoriesController = require("./category.controller");
const { UploadImageCloudinary } = require("../../../Middleware/upload");

const router = express.Router();

router.post(
  "/create",
  UploadImageCloudinary.single("category_image"),
  // validateRequest(JoiCategoriesValidationSchema.categoriesValidationSchema),
  categoriesController.createIndividualCategories
);
router.get("/get-all", categoriesController.getAllCategories);

const categoriesRouter = router;

module.exports = categoriesRouter;
