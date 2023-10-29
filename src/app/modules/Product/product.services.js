const httpStatus = require("http-status");
const ProductModel = require("./product.model");
const ErrorHandler = require("../../../ErrorHandler/errorHandler");
const SubcategoriesModel = require("../SubCategory/subCategories.model");
const CategoriesModel = require("../Category/category.model");

const createProductIntoDB = async (payload) => {
  let { category, subCategory, productTags, product } = payload;

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
    const newSubCategoryIDs = [];

    // ? subCategory create start
    for (const element of subCategory) {
      let subcategory;
      // Check if the element has an _id (ObjectID) property
      if (element._id) {
        // Subcategory already exists, so just add its ObjectID to the category
        subcategory = await SubcategoriesModel.findById(element._id);
      } else {
        // Subcategory doesn't exist, so create a new subcategory
        const newSubCategory = new SubcategoriesModel(element);
        subcategory = await newSubCategory.save({ session });
      }

      // Add the subcategory's ObjectID to the category's subCategory array
      newSubCategoryIDs.push(subcategory?._id);
    }

    // ? subCategory create end

    // ? Category create start
    const newCategoryIDs = [];
    for (const element of category) {
      let categories;
      element.subCategory = newSubCategoryIDs;
      // Check if the element has an _id (ObjectID) property
      if (element._id) {
        // category already exists, so just add its ObjectID to the category
        categories = await CategoriesModel.findById(element._id);
      } else {
        // category doesn't exist, so create a new category

        const newCategory = new CategoriesModel(element);
        categories = await newCategory.save({ session });
      }

      // Add the subcategory's ObjectID to the category's subCategory array
      newCategoryIDs.push(categories?._id);
    }
    // ?category create end

    //? product create
    product.category = newCategoryIDs;
    product.subCategory = newSubCategoryIDs;
    const Product = new ProductModel(product);
    const newProduct = await Product.save({ session });

    await session.commitTransaction();

    return newProduct;
  } catch (error) {
    await session.abortTransaction();
    throw error; // Re-throw the error for the error handling middleware to catch
  } finally {
    // End the session
    session.endSession();
  }
};

const productServices = {
  createProductIntoDB,
};

module.exports = productServices;
