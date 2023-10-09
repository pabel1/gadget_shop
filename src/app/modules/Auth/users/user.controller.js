const catchAsyncError = require("../../../../ErrorHandler/catchAsyncError");
const ErrorHandler = require("../../../../ErrorHandler/errorHandler");
const bcrypt = require("bcrypt");
const userServices = require("./user.services");
const FileUploadHelper = require("../../../../Middleware/uploadMiddleware");
const cloudinaryUploader = require("../../../../Middleware/cloudinaryUpload");
const sendResponse = require("../../../../shared/sendResponse");
const httpStatus = require("http-status");
const userRegistration = catchAsyncError(async (req, res, next) => {
  const file = req.file;
  const folderName = "user";
  const uploadedImage = await cloudinaryUploader.uploadToCloudinary(
    file,
    folderName
  );
  if (uploadedImage) {
    let photo = {
      secure_url: uploadedImage?.secure_url,
      public_id: uploadedImage?.public_id,
    };
    req.body.photo = photo;
  }

  const result = await userServices.createUserInToDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User created successfully",
    data: result,
  });
});

const userController = {
  userRegistration,
};
module.exports = userController;
