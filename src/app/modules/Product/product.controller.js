const httpStatus = require("http-status");
const catchAsyncError = require("../../../ErrorHandler/catchAsyncError");
const uploadAndSetImage = require("../../../shared/uploadNeededServices");
const sendResponse = require("../../../shared/sendResponse");
const productServices = require("./product.services");

const createProduct = catchAsyncError(async (req, res) => {
  const file = req.file;
  // if image ned to upload cloudinary then
  const folderName = "Product";
  await uploadAndSetImage(req, file, folderName);

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

const productController = {
  createProduct,
};
module.exports = productController;
