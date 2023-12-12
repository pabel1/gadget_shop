const httpStatus = require("http-status");
const catchAsyncError = require("../../../ErrorHandler/catchAsyncError");
const uploadAndSetImage = require("../../../shared/uploadNeededServices");
const sendResponse = require("../../../shared/sendResponse");
const productServices = require("./product.services");
const pick = require("../../../shared/pick");
const productConstant = require("./product.constant");
const paginationFields = require("../../../constant/pagination");
const validateRequest = require("../../../Middleware/validateRequest");
const JoiProductValidationSchema = require("./product.validation");
const dataFormaterMiddleware = require("../../../Middleware/dataFormaterMiddleware");
const { parseArrayFields } = require("../../../Helper/parseArrayHelper");
const parseArrayHelper = require("../../../Helper/parseArrayHelper");

const createProduct = catchAsyncError(async (req, res) => {
  // if image ned to upload cloudinary then

  parseArrayHelper.parseArrayFields(req, productConstant.parseAbleField);

  let product = {
    productName: req.body.productName,
    productPrice: req.body.productPrice,
    discount: req.body.discount,
    productDescription: req.body.productDescription,
    productDetails: req.body.productDetails,
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
