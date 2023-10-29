/* eslint-disable node/no-unsupported-features/es-syntax */
const httpStatus = require("http-status");
const ErrorHandler = require("../../../ErrorHandler/errorHandler");
const SubcategoriesModel = require("./subCategories.model");
const { paginationHelpers } = require("../../../Helper/paginationHelper");
const { subCategorySearchableFields } = require("./subCategories.constant");
const { searchHelper } = require("../../../Helper/searchHelper");
const { filteringHelper } = require("../../../Helper/filteringHelper");
const { sortingHelper } = require("../../../Helper/sortingHelper");

const createSubCategoriesIntoDB = async (payload) => {
  const isExist = await SubcategoriesModel.findOne({
    subcategoryName: payload?.subcategoryName,
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
  const matchAnd = [];

  //?Dynamic search added
  const dynamicSearchQuery = searchHelper.createSearchQuery(
    searchTerm,
    subCategorySearchableFields
  );

  if (dynamicSearchQuery) {
    matchAnd.push(dynamicSearchQuery);
  }
  // ? Dynamic filtering added
  const dynamicFilter = filteringHelper.createDynamicFilter(filtersData);

  if (dynamicFilter) {
    matchAnd.push(dynamicFilter);
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

  if (matchAnd.length) {
    pipeline.unshift({
      $match: { $and: matchAnd },
    });
    totalPipeline.unshift({
      $match: { $and: matchAnd },
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
  const newSubCategoryIDs = [];

  for (const element of subCategory) {
    let subcategory;
    if (element._id) {
      subcategory = await SubcategoriesModel.findById(element._id);
    } else {
      const newSubCategory = new SubcategoriesModel(element);
      subcategory = await newSubCategory.save({ session });
    }
    newSubCategoryIDs.push(subcategory._id);
  }

  return newSubCategoryIDs;
};

const SubCategoriesServices = {
  createSubCategoriesIntoDB,
  getAllSubCategoryFromDB,
  createSubCategories,
};
module.exports = SubCategoriesServices;
