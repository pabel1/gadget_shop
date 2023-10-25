const httpStatus = require("http-status");
const catchAsyncError = require("../../../ErrorHandler/catchAsyncError");
const sendResponse = require("../../../shared/sendResponse");
const SubCategoriesServices = require("./subCategories.services");
const uploadAndSetImage = require("../../../shared/uploadNeededServices");

const createSubCategories = catchAsyncError(async (req, res) => {
  const file = req.file;
  // if image ned to upload cloudinary then
  const folderName = "SubCategories";
  await uploadAndSetImage(req, file, folderName);

  const result = await SubCategoriesServices.createSubCategoriesIntoDB(
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "categories created successfully",
    data: {
      result,
    },
  });
});

const subCategoriesController = {
  createSubCategories,
};
module.exports = subCategoriesController;
