const httpStatus = require("http-status");
const catchAsyncError = require("../../../ErrorHandler/catchAsyncError");
const {
  compositeKeyGenerator,
} = require("../../../Helper/compositeKeyGenerator");
const sendResponse = require("../../../shared/sendResponse");
const tagServices = require("./tag.services");
const tagConstant = require("./tag.constant");

const createIndividualTag = catchAsyncError(async (req, res) => {
  const { tagFor, tagTitle } = req.body;
  //   generate compositeKey
  const compositeKey = compositeKeyGenerator.generateCompositKey({
    keyFor: tagConstant?.compositeKeyFor[0] || "tag",
    tagFor,
    tagTitle,
  });
  req.body.tagCompositKey = compositeKey;
  const result = await tagServices.createTagIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Tag created successfully",
    data: {
      result,
    },
  });
});
const createTag = catchAsyncError(async (req, res) => {
  const { tagFor, tagTitle } = req.body;
  //   generate compositeKey
  const compositeKey = compositeKeyGenerator.generateCompositKey({
    keyFor: tagConstant?.compositeKeyFor[0] || "tag",
    tagFor,
    tagTitle,
  });
  req.body.tagCompositKey = compositeKey;
  const result = await tagServices.createTagIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Tag created successfully",
    data: {
      result,
    },
  });
});

const tagController = {
  createTag,
  createIndividualTag,
};
module.exports = tagController;
