const httpStatus = require("http-status");
const ProductModel = require("./product.model");
const ErrorHandler = require("../../../ErrorHandler/errorHandler");

const createProductIntoDB = async (payload) => {
  const isExist = await ProductModel.findOne({
    subcategoryName: payload?.subcategoryName,
  });
  if (isExist) {
    throw new ErrorHandler(
      `${isExist.subcategoryName} this Subcategory already axist!`,
      httpStatus.CONFLICT
    );
  }
  const subCategories = new ProductModel(payload);
  const newSubCategory = await subCategories.save();
  return { newSubCategory };
};

const productServices = {
  createProductIntoDB,
};

module.exports = productServices;
