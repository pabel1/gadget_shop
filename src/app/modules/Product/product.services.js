const httpStatus = require("http-status");
const ProductModel = require("./product.model");
const ErrorHandler = require("../../../ErrorHandler/errorHandler");
const { default: mongoose } = require("mongoose");
const SubCategoriesServices = require("../SubCategory/subCategories.services");
const CategoriesServices = require("../Category/category.services");
const JoiProductValidationSchema = require("./product.validation");
const tagServices = require("../Tag/tag.services");

const createProductIntoDB = async (payload) => {
  let { category, subCategory, tags, product } = payload;

  const compositeKey = `p-${product?.productName.substring(0, 5)}-${
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

const geAllProductFromDB = async (filters, paginationOptions) => {};

const productServices = {
  createProductIntoDB,
  createProduct,
  geAllProductFromDB,
};

module.exports = productServices;
