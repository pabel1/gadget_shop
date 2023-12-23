/* eslint-disable node/no-extraneous-require */
const express = require("express");
const validateRequest = require("../../../Middleware/validateRequest");
const JoiTagValidationSchema = require("./tag.validation");
const tagController = require("./tag.controller");
const authVerification = require("../../../Middleware/authVarification");

const router = express.Router();
router.post(
  "/create",
  authVerification,
  validateRequest(JoiTagValidationSchema.createTagValidationSchema),
  tagController.createTag
);

const tagRouter = router;
module.exports = tagRouter;
