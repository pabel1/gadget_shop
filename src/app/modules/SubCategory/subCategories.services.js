const httpStatus = require("http-status");
const ErrorHandler = require("../../../ErrorHandler/errorHandler");
const SubcategoriesModel = require("./subCategories.model");
const { default: mongoose } = require("mongoose");

const createSubCategoriesIntoDB = async (payload) => {
  const isExist = await SubcategoriesModel.findOne({
    subcategoryName: payload?.subcategoryName,
  });
  if (isExist) {
    throw new ErrorHandler(
      `${isExist.subcategoryName} this Subcategory already axist!`,
      httpStatus.CONFLICT
    );
  }
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const subCategories = new SubcategoriesModel(payload);
    const newSubCategory = await subCategories.save({ session });

    await session.commitTransaction();
    session.endSession();
    return { newSubCategory };
  } catch (error) {
    console.log(error);
  }
};

const SubCategoriesServices = {
  createSubCategoriesIntoDB,
};

module.exports = SubCategoriesServices;
