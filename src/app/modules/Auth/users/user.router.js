/* eslint-disable node/no-extraneous-require */
const express = require("express");
const userController = require("./user.controller");
const validateRequest = require("../../../../Middleware/validateRequest");
const FileUploadHelper = require("../../../../Middleware/uploadMiddleware");
const JoiValidationSchema = require("./user.validation");
const authVerification = require("../../../../Middleware/authVarification");

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
router.get("/logged-in-user", authVerification, userController.loggedInUser);

router.post(
  "/refresh-token",
  validateRequest(JoiValidationSchema.refreshTokenJoiSchema),
  userController.refreshToken
);
router.post("/logout", userController.logout);

const userRouter = router;

module.exports = userRouter;
