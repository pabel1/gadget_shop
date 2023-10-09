const ErrorHandler = require("../../../../ErrorHandler/errorHandler");
const UserModel = require("./user.model");
const httpStatus = require("http-status");
const createUserInToDB = async (payload) => {
  const user = await UserModel.findOne({ email: payload?.email });
  if (user) {
    throw new ErrorHandler("User already axist!", httpStatus.CONFLICT);
  }

  const newUser = new UserModel(payload);
  const userData = await newUser.save();

  return userData;
};

const userServices = {
  createUserInToDB,
};

module.exports = userServices;
