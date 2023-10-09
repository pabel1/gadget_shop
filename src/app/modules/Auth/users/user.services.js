const ErrorHandler = require("../../../../ErrorHandler/errorHandler");
const config = require("../../../../config/config");
const jwtHandle = require("../../../../shared/createToken");
const UserModel = require("./user.model");
const httpStatus = require("http-status");
const createUserInToDB = async (payload) => {
  const user = await UserModel.findOne({ email: payload?.email });
  if (user) {
    throw new ErrorHandler("User already axist!", httpStatus.CONFLICT);
  }
  const newUser = new UserModel(payload);
  const userData = await newUser.save();

  let accessToken, refreshToken;
  if (userData) {
    accessToken = await jwtHandle(
      { id: userData?._id, email: userData?.email },
      config.jwt_key,
      config.jwt_token_expire
    );

    refreshToken = await jwtHandle(
      { id: userData?._id, email: userData?.email },
      config.jwt_refresh_key,
      config.jwt_refresh_token_expire
    );
  }
  console.log(refreshToken);
  console.log(accessToken);
  return { userData, accessToken, refreshToken };
};

const userServices = {
  createUserInToDB,
};

module.exports = userServices;
