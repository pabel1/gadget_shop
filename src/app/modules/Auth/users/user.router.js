const express = require("express");
const userController = require("./user.controller");
const userJoiSchema = require("./user.validation");
const validateRequest = require("../../../../Middleware/validateRequest");
const FileUploadHelper = require("../../../../Middleware/uploadMiddleware");

const router = express.Router();

router.post(
  "/create",
  FileUploadHelper.upload.single("image"),
  validateRequest(userJoiSchema),
  userController.userRegistration
);
const userRouter = router;

module.exports = userRouter;
