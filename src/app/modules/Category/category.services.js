const httpStatus = require("http-status");
const ErrorHandler = require("../../../ErrorHandler/errorHandler");
const CategoriesModel = require("./category.model");
const { default: mongoose } = require("mongoose");
const SubcategoriesModel = require("../SubCategory/subCategories.model");
const JoiCategoriesValidationSchema = require("./categories.validation");

const createCategoriesIntoDB = async (payload) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const { categoryName, subCategory } = payload;
    console.log(subCategory, "subCategory");

    // Check if the category with the same name already exists
    const isExist = await CategoriesModel.findOne({ categoryName });
    if (isExist) {
      throw new ErrorHandler(
        `${categoryName} this category already exists!`,
        httpStatus.CONFLICT
      );
    }
    const newSubCategoryIDs = [];

    console.log(Array.isArray(subCategory));

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

    if (newSubCategoryIDs.length !== 0) {
      payload.subCategory = newSubCategoryIDs;
    }
    const category = new CategoriesModel(payload);
    const newCategory = await category.save({ session });

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
  const newCategoryIDs = [];

  for (const element of category) {
    element.subCategory = newSubCategoryIDs;
    let categories;
    if (element._id) {
      categories = await CategoriesModel.findById(element._id);
    } else {
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
    newCategoryIDs.push(categories._id);
  }

  return newCategoryIDs;
};
const CategoriesServices = {
  createCategoriesIntoDB,
  createCategories,
};
module.exports = CategoriesServices;
