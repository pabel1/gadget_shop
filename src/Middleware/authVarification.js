const jwt = require("jsonwebtoken");
const ErrorHandler = require("../ErrorHandler/errorHandler");
const UserModel = require("../app/modules/Auth/users/user.model");
const httpStatus = require("http-status");

const authVerification = async (req, res, next) => {
  try {
    let token;
    if (req.cookies.access_token) {
      token = req.cookies.access_token;
    } else {
      const { authorization } = req.headers;

      token = authorization?.split(" ")[1];
    }
    if (!token) {
      throw new ErrorHandler("Please login to access the resource", 401);
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const { email, userId } = decoded;
    req.email = email;
    // console.log(decoded);
    const rootUser = await UserModel.findOne({ email: email });
    // console.log(rootUser);
    if (!rootUser) {
      throw new ErrorHandler("User not found", 404);
    }
    req.user = rootUser;
    req.userId = userId;
    req.email = email;
    next();
  } catch (error) {
    next(error, httpStatus.UNAUTHORIZED);
  }
};

module.exports = authVerification;
