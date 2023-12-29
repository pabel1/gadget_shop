const httpStatus = require("http-status");
const catchAsyncError = require("../../../ErrorHandler/catchAsyncError");
const sendResponse = require("../../../shared/sendResponse");
const SubCategoriesServices = require("./subCategories.services");

const pick = require("../../../shared/pick");
const subCategoriesConstant = require("./subCategories.constant");
const paginationFields = require("../../../constant/pagination");

const createSubCategories = catchAsyncError(async (req, res) => {
  console.log(req?.file);
  // if image ned to upload cloudinary then
  if (req?.file) {
    req.body.photo = {
      secure_url: req.file.path,
      public_id: req.file.filename,
    };
  }
  console.log(req.body);
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
  const paginationOptions = pick(req.query, paginationFields);
  const result = await SubCategoriesServices.getAllSubCategoryFromDB(
    filters,
    paginationOptions
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
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
