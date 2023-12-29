const httpStatus = require("http-status");
const catchAsyncError = require("../../../ErrorHandler/catchAsyncError");
const CategoriesServices = require("./category.services");
const sendResponse = require("../../../shared/sendResponse");
const uploadAndSetImage = require("../../../shared/uploadNeededServices");
const parseArrayHelper = require("../../../Helper/parseArrayHelper");
const categoriesConstant = require("./categories.constant");
const pick = require("../../../shared/pick");
const subCategoriesConstant = require("../SubCategory/subCategories.constant");
const paginationFields = require("../../../constant/pagination");

const createIndividualCategories = catchAsyncError(async (req, res) => {
  parseArrayHelper.parseArrayFields(
    req,
    categoriesConstant.categoriesParseAbleConstant
  );
  console.log(req.body.subCategory);
  const file = req.file;
  if (file) {
    req.body.photo = {
      secure_url: file.path,
      public_id: file.filename,
    };
  }
  console.log(req.body.subCategory);

  const result = await CategoriesServices.createIndividualCategoriesIntoDB(
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

const getAllCategories = catchAsyncError(async (req, res) => {
  const filters = pick(req.query, categoriesConstant.categoryFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await CategoriesServices.getAllCategoryFromDB(
    filters,
    paginationOptions
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "categories Get successfully",
    meta: result.meta,
    data: result.data,
  });
});
const categoriesController = {
  createCategories,
  createIndividualCategories,
  getAllCategories,
};
module.exports = categoriesController;
