const catchAsyncError = require("../../../../ErrorHandler/catchAsyncError");

const userServices = require("./user.services");

const cloudinaryUploader = require("../../../../Middleware/cloudinaryUpload");
const sendResponse = require("../../../../shared/sendResponse");
const httpStatus = require("http-status");
const config = require("../../../../config/config");
const userRegistration = catchAsyncError(async (req, res) => {
  const file = req.file;
  const folderName = "user";
  const uploadedImage = await cloudinaryUploader.uploadToCloudinary(
    file,
    folderName
  );
  if (uploadedImage) {
    let photo = {
      secure_url: uploadedImage?.secure_url,
      public_id: uploadedImage?.public_id,
    };
    req.body.photo = photo;
  }

  const result = await userServices.createUserInToDB(req.body);
  const { refreshToken, accessToken, userData } = result;

  if (refreshToken && accessToken && userData) {
    let cookieOptions = {
      secure: config.env === "production",
      httpOnly: true,
    };

    res.cookie("refreshToken", refreshToken, cookieOptions);
    res.cookie("accessToken", accessToken, cookieOptions);
  }

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User created successfully",
    data: {
      userData,
      accessToken,
    },
  });
});

const userLogin = catchAsyncError(async (req, res) => {
  const result = await userServices.loginUserInToDB(req.body);
  const { refreshToken, accessToken, user } = result;

  if (refreshToken && accessToken && user) {
    let cookieOptions = {
      secure: config.env === "production",
      httpOnly: true,
    };

    res.cookie("refreshToken", refreshToken, cookieOptions);
    res.cookie("accessToken", accessToken, cookieOptions);
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User Login successfully",
    data: {
      user,
      accessToken,
    },
  });
});

const loggedInUser = catchAsyncError(async (req, res) => {
  const result = await userServices.loggedInUserFromDB(req.user._id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "LoggedIn  user",
    data: {
      result,
    },
  });
});

// get new access token from using  refresh token
const refreshToken = catchAsyncError(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await userServices.refreshTokenFromDB(refreshToken);
  // set refresh token into cookie
  const cookieOptions = {
    secure: config.env === "production",
    httpOnly: true,
  };

  res.cookie("refreshToken", refreshToken, cookieOptions);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Token Get ",
    data: {
      result,
    },
  });
});

const userController = {
  userRegistration,
  userLogin,
  loggedInUser,
  refreshToken,
};
module.exports = userController;
