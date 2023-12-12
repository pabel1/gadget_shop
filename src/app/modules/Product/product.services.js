/* eslint-disable node/no-unsupported-features/es-syntax */
const httpStatus = require("http-status");
const ProductModel = require("./product.model");
const ErrorHandler = require("../../../ErrorHandler/errorHandler");
const { default: mongoose } = require("mongoose");
const SubCategoriesServices = require("../SubCategory/subCategories.services");
const CategoriesServices = require("../Category/category.services");
const JoiProductValidationSchema = require("./product.validation");
const tagServices = require("../Tag/tag.services");
const { paginationHelpers } = require("../../../Helper/paginationHelper");
const { searchHelper } = require("../../../Helper/searchHelper");

const { filteringHelper } = require("../../../Helper/filteringHelper");
const { sortingHelper } = require("../../../Helper/sortingHelper");
const { productSearchableFields } = require("./product.constant");

const createProductIntoDB = async (payload) => {
  let { category, subCategory, tags, product } = payload;

  const compositeKey = `p-${product?.productName?.substring(0, 5)}-${
    product?.productPrice
  }`;
  // Check if a product with the same compositeKey exists
  const isExist = await ProductModel.findOne({
    compositeKey: compositeKey,
  });
  if (isExist) {
    throw new ErrorHandler(
      `${isExist.productName} this Product already axist!`,
      httpStatus.CONFLICT
    );
  }
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    // SubCategory creation
    const newSubCategoryIDs = await SubCategoriesServices.createSubCategories(
      session,
      subCategory
    );

    // Category creation
    const newCategoryIDs = await CategoriesServices.createCategories(
      session,
      category,
      newSubCategoryIDs
    );

    // tagCreation
    const newTagsIDs = await tagServices.createTag(session, tags);

    // Product creation
    product.category = newCategoryIDs;
    product.subCategory = newSubCategoryIDs;
    product.productTags = newTagsIDs;
    const newProduct = await createProduct(session, product);

    await session.commitTransaction();
    return newProduct;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    // End the session
    session.endSession();
  }
};

const createProduct = async (session, product) => {
  const { error } =
    JoiProductValidationSchema.createProductValidationSchema.validate(product);
  if (error) {
    throw new ErrorHandler(error, httpStatus.BAD_REQUEST);
  }
  const Product = new ProductModel(product);
  return await Product.save({ session });
};

const geAllProductFromDB = async (filters, paginationOptions) => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const pipeline = [];
  const totalPipeline = [{ $count: "count" }];
  const matchAnd = [];

  //?Dynamic search added
  const dynamicSearchQuery = searchHelper.createSearchQuery(
    searchTerm,
    productSearchableFields
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
  const result = await ProductModel.aggregate(pipeline);
  const total = await ProductModel.aggregate(totalPipeline);

  return {
    meta: {
      page,
      limit,
      total: total[0]?.count,
    },
    data: result,
  };
};

const productServices = {
  createProductIntoDB,
  createProduct,
  geAllProductFromDB,
};

module.exports = productServices;
