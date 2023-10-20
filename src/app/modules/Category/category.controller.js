const httpStatus = require("http-status");
const catchAsyncError = require("../../../ErrorHandler/catchAsyncError");
const cloudinaryUploader = require("../../../Middleware/cloudinaryUpload");
const CategoriesServices = require("./category.services");
const sendResponse = require("../../../shared/sendResponse");

const createCategories = catchAsyncError(async (req, res) => {
  const file = req.file;
  const folderName = "categories";
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

  const result = await CategoriesServices.createCategoriesIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "categories created successfully",
    data: {
      result,
    },
  });
});

const categoriesController = {
  createCategories,
};
module.exports = categoriesController;
