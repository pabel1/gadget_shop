/* eslint-disable node/no-extraneous-require */
const express = require("express");
const passport = require("passport");
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

//   for google authentication using O auth2.0 with passport js
router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: process.env.CLIENT_URL,
    failureRedirect: "/login/failed",
  })
);
const userRouter = router;

module.exports = userRouter;
