const httpStatus = require("http-status");
const catchAsyncError = require("../../../ErrorHandler/catchAsyncError");
const sendResponse = require("../../../shared/sendResponse");
const productServices = require("./product.services");
const pick = require("../../../shared/pick");
const productConstant = require("./product.constant");
const paginationFields = require("../../../constant/pagination");
const parseArrayHelper = require("../../../Helper/parseArrayHelper");
const createProduct = catchAsyncError(async (req, res) => {
  parseArrayHelper.parseArrayFields(req, productConstant.parseAbleField);

  let product = {
    productName: req.body.productName,
    productPrice: req.body.productPrice,
    discount: req.body.discount,
    productDescription: req.body.productDescription,
    productDetails: req.body.productDetails,
    productImage: req?.files?.product_image?.map((file) => ({
      url: file.path,
      public_id: file.filename,
    })),
  };
  if (!req.body.product || req.body.product.length === 0) {
    req.body.product = product;
  }

  const result = await productServices.createProductIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Product created successfully",
    data: {
      result,
    },
  });
});

const getAllProduct = catchAsyncError(async (req, res) => {
  const filters = pick(req.query, productConstant.productFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await productServices.geAllProductFromDB(
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

const productController = {
  createProduct,
  getAllProduct,
};
module.exports = productController;
