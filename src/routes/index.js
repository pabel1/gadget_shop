const express = require("express");
const userRouter = require("../app/modules/Auth/users/user.router");
const googleauthRouter = require("../app/modules/Auth/Oauth2/google.auth.route");

const router = express.Router();

const routes = [
  {
    path: "/user",
    route: userRouter,
  },
  {
    path: "/auth/google/",
    route: googleauthRouter,
  },
];

routes.forEach((route) => router.use(route.path, route.route));

module.exports = router;
