/* eslint-disable node/no-unsupported-features/es-syntax */
const httpStatus = require("http-status");
const ErrorHandler = require("../../../ErrorHandler/errorHandler");
const SubcategoriesModel = require("./subCategories.model");
const { paginationHelpers } = require("../../../Helper/paginationHelper");
const { subCategorySearchableFields } = require("./subCategories.constant");
const { searchHelper } = require("../../../Helper/searchHelper");
const { filteringHelper } = require("../../../Helper/filteringHelper");
const { sortingHelper } = require("../../../Helper/sortingHelper");
const JoiSubCategoriesValidationSchema = require("./subCategories.validation");
const { default: mongoose } = require("mongoose");
const generateSlug = require("../../../shared/generateSlug");

const createSubCategoriesIntoDB = async (payload) => {
  const subCategorySlug = generateSlug(payload?.subcategoryName);
  const isExist = await SubcategoriesModel.findOne({
    slug: subCategorySlug,
  });
  if (isExist) {
    throw new ErrorHandler(
      `${isExist.subcategoryName} this Subcategory already exist!`,
      httpStatus.CONFLICT
    );
  }
  const subCategories = new SubcategoriesModel(payload);
  const newSubCategory = await subCategories.save();

  return newSubCategory;
};

const getAllSubCategoryFromDB = async (filters, paginationOptions) => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const pipeline = [];
  const totalPipeline = [{ $count: "count" }];
  const match = {};

  //?Dynamic search added
  const dynamicSearchQuery = searchHelper.createSearchQuery(
    searchTerm,
    subCategorySearchableFields
  );

  if (dynamicSearchQuery && dynamicSearchQuery.length) {
    match.$or = dynamicSearchQuery;
  }
  // ? Dynamic filtering added
  const dynamicFilter = filteringHelper.createDynamicFilter(filtersData);
  if (dynamicFilter && dynamicFilter.length) {
    match.$and = dynamicFilter;
  }
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

  // if join projection and otherneeded for before match ar unshift then write here
  if (Object.keys(match).length) {
    pipeline.unshift({
      $match: match,
    });
    totalPipeline.unshift({
      $match: match,
    });
  }
  const result = await SubcategoriesModel.aggregate(pipeline);
  const total = await SubcategoriesModel.aggregate(totalPipeline);

  return {
    meta: {
      page,
      limit,
      total: total[0]?.count,
    },
    data: result,
  };
};

const createSubCategories = async (session, subCategory) => {
  let newSubCategoryIDs = [];

  for (const element of subCategory) {
    let subcategory;
    if (element._id) {
      subcategory = await SubcategoriesModel.findById(element._id);
    } else {
      const { error } =
        JoiSubCategoriesValidationSchema.createSubCategoriesValidationSchema.validate(
          element
        );
      if (error) {
        throw new ErrorHandler(error, httpStatus.BAD_REQUEST);
      }
      const newSubCategory = new SubcategoriesModel(element);
      subcategory = await newSubCategory.save({ session });
    }

    newSubCategoryIDs.push(subcategory?._id.toString());
  }
  newSubCategoryIDs = newSubCategoryIDs.filter((id) =>
    mongoose.Types.ObjectId.isValid(id)
  );

  return newSubCategoryIDs;
};

const SubCategoriesServices = {
  createSubCategoriesIntoDB,
  getAllSubCategoryFromDB,
  createSubCategories,
};
module.exports = SubCategoriesServices;
