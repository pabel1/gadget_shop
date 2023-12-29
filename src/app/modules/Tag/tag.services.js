const httpStatus = require("http-status");
const ErrorHandler = require("../../../ErrorHandler/errorHandler");
const TagModel = require("./tag.model");
const JoiTagValidationSchema = require("./tag.validation");
const {
  compositeKeyGenerator,
} = require("../../../Helper/compositeKeyGenerator");
const { default: mongoose } = require("mongoose");
const { paginationHelpers } = require("../../../Helper/paginationHelper");
const { searchHelper } = require("../../../Helper/searchHelper");
const { tagCompositConstant } = require("./tag.constant");
const tagConstant = require("./tag.constant");
const { filteringHelper } = require("../../../Helper/filteringHelper");
const { sortingHelper } = require("../../../Helper/sortingHelper");

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
  let newTagsIDs = [];

  if (tags && Array.isArray(tags)) {
    for (const element of tags) {
      let tag;
      if (element?._id) {
        tag = await TagModel.findById(element?._id);
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
      newTagsIDs.push(tag?._id.toString());
    }
  }
  newTagsIDs = newTagsIDs.filter((id) => mongoose.Types.ObjectId.isValid(id));
  return newTagsIDs;
};

const getAllTagsFromDB = async (filters, paginationOptions) => {
  const { searchTerm, ...filtersData } = filters;
  console.log("filtersData", filtersData);
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const pipeline = [];
  const totalPipeline = [{ $count: "count" }];
  const match = {};

  //?Dynamic search added
  const dynamicSearchQuery = searchHelper.createSearchQuery(
    searchTerm,
    tagConstant.tagsSearchableFields
  );

  if (dynamicSearchQuery && dynamicSearchQuery.length) {
    match.$or = dynamicSearchQuery;
  }
  // ? Dynamic filtering added
  const dynamicFilter = filteringHelper.createDynamicFilter(filtersData);
  if (dynamicFilter && dynamicFilter.length) {
    match.$and = dynamicFilter;
  }

  // if join projection and otherneeded for before match ar unshift then write here

  if (skip) {
    pipeline.push({ $skip: skip });
  }

  if (limit) {
    pipeline.push({ $limit: limit });
  }

  // sorting
  const dynamicSorting = sortingHelper.createDynamicSorting(sortBy, sortOrder);

  if (dynamicSorting) {
    pipeline.push({
      $sort: dynamicSorting,
    });
  }

  if (Object.keys(match).length) {
    pipeline.unshift({
      $match: match,
    });
    totalPipeline.unshift({
      $match: match,
    });
  }
  const result = await TagModel.aggregate(pipeline);
  const total = await TagModel.aggregate(totalPipeline);
  return {
    meta: {
      page,
      limit,
      total: total[0]?.count,
    },
    data: result,
  };
};

const tagServices = {
  createTagIntoDB,
  createTag,
  getAllTagsFromDB,
};

module.exports = tagServices;
