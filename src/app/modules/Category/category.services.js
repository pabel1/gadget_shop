const httpStatus = require("http-status");
const ErrorHandler = require("../../../ErrorHandler/errorHandler");
const CategoriesModel = require("./category.model");
const { default: mongoose } = require("mongoose");

const JoiCategoriesValidationSchema = require("./categories.validation");
const generateSlug = require("../../../shared/generateSlug");
const SubCategoriesServices = require("../SubCategory/subCategories.services");
const { paginationHelpers } = require("../../../Helper/paginationHelper");
const { searchHelper } = require("../../../Helper/searchHelper");
const categoriesConstant = require("./categories.constant");
const { filteringHelper } = require("../../../Helper/filteringHelper");
const { sortingHelper } = require("../../../Helper/sortingHelper");

const createIndividualCategoriesIntoDB = async (payload) => {
  const categorySlug = generateSlug(payload?.categoryName);
  const isExist = await CategoriesModel.findOne({
    slug: categorySlug,
  });
  if (isExist) {
    throw new ErrorHandler(
      `${isExist.categoryName} this category already exist!`,
      httpStatus.CONFLICT
    );
  }
  let { subCategory } = payload;

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    // SubCategory creation
    const newSubCategoryIDs = await SubCategoriesServices.createSubCategories(
      session,
      subCategory
    );

    payload.subCategory = newSubCategoryIDs;
    const categories = new CategoriesModel(payload);
    const newCategory = await categories.save({ session });
    await session.commitTransaction();
    return newCategory;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    // End the session
    session.endSession();
  }
};
const createCategories = async (session, category, newSubCategoryIDs) => {
  let newCategoryIDs = [];
  console.log("newSubCategoryIDs", newSubCategoryIDs);
  for (const element of category) {
    element.subCategory = newSubCategoryIDs;
    console.log({ CategoriesSub: element.subCategory });
    let categories;
    if (element._id) {
      categories = await CategoriesModel.findById(element._id);
    } else {
      console.log("categoris_element:", element);
      const { error } =
        JoiCategoriesValidationSchema.categoriesValidationSchema.validate(
          element
        );
      if (error) {
        throw new ErrorHandler(error, httpStatus.BAD_REQUEST);
      }

      const newCategory = new CategoriesModel(element);
      categories = await newCategory.save({ session });
    }
    newCategoryIDs.push(categories?._id.toString());
  }

  newCategoryIDs = newCategoryIDs.filter((id) =>
    mongoose.Types.ObjectId.isValid(id)
  );

  return newCategoryIDs;
};

const getAllCategoryFromDB = async (filters, paginationOptions) => {
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
    categoriesConstant.categorySearchableFields
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
  const result = await CategoriesModel.aggregate(pipeline);
  const total = await CategoriesModel.aggregate(totalPipeline);

  return {
    meta: {
      page,
      limit,
      total: total[0]?.count,
    },
    data: result,
  };
};
const CategoriesServices = {
  createIndividualCategoriesIntoDB,
  createCategories,
  getAllCategoryFromDB,
};
module.exports = CategoriesServices;
