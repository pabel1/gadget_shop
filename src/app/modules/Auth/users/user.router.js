const express = require("express");
const userController = require("./user.controller");

const validateRequest = require("../../../../Middleware/validateRequest");
const FileUploadHelper = require("../../../../Middleware/uploadMiddleware");
const JoiValidationSchema = require("./user.validation");

const router = express.Router();

router.post(
  "/create",
  FileUploadHelper.upload.single("image"),
  validateRequest(JoiValidationSchema.userJoiSchema),
  userController.userRegistration
);
router.post(
  "/login",
  validateRequest(JoiValidationSchema.loginSchema),
  userController.userLogin
);
const userRouter = router;

module.exports = userRouter;
