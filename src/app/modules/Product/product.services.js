const httpStatus = require("http-status");
const ProductModel = require("./product.model");
const ErrorHandler = require("../../../ErrorHandler/errorHandler");

const createProductIntoDB = async (payload) => {
  const compositeKey = `p-${payload?.productName.substring(0, 5)}-${
    payload?.productPrice
  }`;

  // Check if a product with the same compositeKey exists

  const isExist = await ProductModel.findOne({
    compositeKey: compositeKey,
  });
  if (isExist) {
    throw new ErrorHandler(
      `${isExist.productName} this Product already axist!`,
      httpStatus.CONFLICT
    );
  }
  const product = new ProductModel(payload);
  const newProduct = await product.save();
  return { newProduct };
};

const productServices = {
  createProductIntoDB,
};

module.exports = productServices;
