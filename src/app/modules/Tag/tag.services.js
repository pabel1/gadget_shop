const httpStatus = require("http-status");
const ErrorHandler = require("../../../ErrorHandler/errorHandler");
const TagModel = require("./tag.model");
const JoiTagValidationSchema = require("./tag.validation");
const {
  compositeKeyGenerator,
} = require("../../../Helper/compositeKeyGenerator");

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

const createTag = async (session, tags) => {
  const newTagsIDs = [];

  if (tags && Array.isArray(tags)) {
    for (const element of tags) {
      let tag;
      if (element._id) {
        tag = await TagModel.findById(element._id);
      } else {
        const { error } =
          JoiTagValidationSchema.createTagValidationSchema.validate(element);
        if (error) {
          throw new ErrorHandler(error, httpStatus.BAD_REQUEST);
        }

        //   generate compositeKey
        const { tagFor, tagTitle } = element || {};
        const compositeKey = compositeKeyGenerator.generateCompositKey({
          keyFor: "product",
          tagFor,
          tagTitle,
        });
        element.tagCompositKey = compositeKey;
        const newTag = new TagModel(element);
        tag = await newTag.save({ session });
      }
      newTagsIDs.push(tag._id);
    }
  }

  return newTagsIDs;
};

const tagServices = {
  createTagIntoDB,
  createTag,
};

module.exports = tagServices;
