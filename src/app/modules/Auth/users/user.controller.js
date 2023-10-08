const catchAsyncError = require("../../../../ErrorHandler/catchAsyncError");
const ErrorHandler = require("../../../../ErrorHandler/errorHandler");
const bcrypt = require("bcrypt");
const userRegistration = catchAsyncError(async (req, res, next) => {
  //   const { fullname, email, password, phone, gender } = req.body;

  //   if (!email || !password || !fullname || !phone) {
  //     return next(new ErrorHandler("Please fill the value properly", 400));
  //   }
  console.log("first");
  let myCloud;
  // if (req.body.photo) {
  //   myCloud = await cloudinary.v2.uploader.upload(req.body.photo, {
  //     folder: "ayykori_management_users",
  //     width: 150,
  //     crop: "scale",
  //   });
  // }
});

const userController = {
  userRegistration,
};
module.exports = userController;
