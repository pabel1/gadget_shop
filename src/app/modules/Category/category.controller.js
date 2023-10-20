const httpStatus = require("http-status");
const catchAsyncError = require("../../../ErrorHandler/catchAsyncError");
const CategoriesServices = require("./category.services");
const sendResponse = require("../../../shared/sendResponse");
const uploadAndSetImage = require("../../../shared/uploadNeededServices");

const createCategories = catchAsyncError(async (req, res) => {
  const file = req.file;

  // if image ned to upload cloudinary then
  const folderName = "Categories";
  await uploadAndSetImage(req, file, folderName);

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
