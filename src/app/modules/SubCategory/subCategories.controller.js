const httpStatus = require("http-status");
const catchAsyncError = require("../../../ErrorHandler/catchAsyncError");
const sendResponse = require("../../../shared/sendResponse");
const SubCategoriesServices = require("./subCategories.services");
const uploadAndSetImage = require("../../../shared/uploadNeededServices");
const pick = require("../../../shared/pick");
const subCategoriesConstant = require("./subCategories.constant");

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

const getAllSubCategoriesFromDB = catchAsyncError(async (req, res) => {
  const filters = pick(
    req.query,
    subCategoriesConstant.subCategoryFilterableFields
  );
  const paginationOptions = pick(
    req.query,
    subCategoriesConstant.subCategorySearchableFields
  );
  const result = await SubCategoriesServices.getAllSubCategoryFromDB(
    filters,
    paginationOptions
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "categories created successfully",
    meta: result.meta,
    data: result.data,
  });
});

const subCategoriesController = {
  createSubCategories,
  getAllSubCategoriesFromDB,
};
module.exports = subCategoriesController;
