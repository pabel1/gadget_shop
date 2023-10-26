const httpStatus = require("http-status");
const ErrorHandler = require("../../../ErrorHandler/errorHandler");
const SubcategoriesModel = require("./subCategories.model");

const createSubCategoriesIntoDB = async (payload) => {
  const isExist = await SubcategoriesModel.findOne({
    subcategoryName: payload?.subcategoryName,
  });
  if (isExist) {
    throw new ErrorHandler(
      `${isExist.subcategoryName} this Subcategory already exist!`,
      httpStatus.CONFLICT
    );
  }
  const subCategories = new SubcategoriesModel(payload);
  const newSubCategory = await subCategories.save();

  return newSubCategory;
};
const getAllSubCategoryFromDB = async (payload) => {
  const isExist = await SubcategoriesModel.findOne({
    subcategoryName: payload?.subcategoryName,
  });
  if (isExist) {
    throw new ErrorHandler(
      `${isExist.subcategoryName} this Subcategory already exist!`,
      httpStatus.CONFLICT
    );
  }
  const subCategories = new SubcategoriesModel(payload);
  const newSubCategory = await subCategories.save();

  return newSubCategory;
};
const SubCategoriesServices = {
  createSubCategoriesIntoDB,
  getAllSubCategoryFromDB,
};
module.exports = SubCategoriesServices;
