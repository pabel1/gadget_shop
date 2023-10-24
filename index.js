/* eslint-disable node/no-extraneous-require */
const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");
const httpStatus = require("http-status");
const globalErrorHandler = require("./src/Middleware/globalErrorHandler");
const router = require("./src/routes");
const passport = require("passport");
const session = require("express-session");
const config = require("./src/config/config");
const createCorsOptions = require("./src/shared/corsOptions");
const allowedOrigins = require("./src/constant/corsOrigin");
const googleauthRouter = require("./src/app/modules/Auth/Oauth2/google.auth.route");
require("./src/app/modules/Auth/Oauth2/auth.google");
const app = express();

app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: config.googleClientSecret, // Replace with a secure, random secret key
  })
);
const corsOptions = createCorsOptions(allowedOrigins);
app.use(cookieParser());
app.use(cors(corsOptions));

app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));

app.use(passport.initialize());
app.use(passport.session());

// define routes
app.use("/api/v1", router);
app.use("auth/google", googleauthRouter);

// global error handler
app.use(globalErrorHandler);

// not found Route Defined
app.use((req, res, next) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "Not Found!!",
    errorMessage: [
      {
        path: req.originalUrl,
        message: `${req.originalUrl}-This Route Not Found!!`,
      },
    ],
  });
  next();
});

module.exports = app;
