const httpStatus = require("http-status");
const ErrorHandler = require("../../../ErrorHandler/errorHandler");
const CategoriesModel = require("./category.model");

const createCategoriesIntoDB = async (payload) => {
  const isExist = await CategoriesModel.findOne({
    categoryName: payload?.categoryName,
  });
  if (isExist) {
    throw new ErrorHandler(
      `${isExist.categoryName} this category already axist!`,
      httpStatus.CONFLICT
    );
  }
  const category = new CategoriesModel(payload);
  const newCategory = await category.save();
  return { newCategory };
};

const CategoriesServices = {
  createCategoriesIntoDB,
};

module.exports = CategoriesServices;
