const httpStatus = require("http-status");
const ErrorHandler = require("../../../ErrorHandler/errorHandler");
const TagModel = require("./tag.model");

const createTagIntoDB = async (payload) => {
  const isExist = await TagModel.findOne({
    tagCompositKey: payload?.tagCompositKey,
  });
  if (isExist) {
    throw new ErrorHandler(
      `${isExist.tagCompositKey} this Tag already exist!`,
      httpStatus.CONFLICT
    );
  }
  const tag = new TagModel(payload);
  const newTag = await tag.save();

  return newTag;
};

const tagServices = {
  createTagIntoDB,
};

module.exports = tagServices;
