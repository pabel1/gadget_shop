const express = require("express");
const userController = require("./user.controller");
const userJoiSchema = require("./user.validation");
const validateRequest = require("../../../../Middleware/validateRequest");

const router = express.Router();

router.post(
  "/create",
  validateRequest(userJoiSchema),
  userController.userRegistration
);
const userRouter = router;

module.exports = userRouter;
