const express = require("express");
const userRouter = require("../app/modules/Auth/users/user.router");
const authRouter = require("../app/modules/Auth/Oauth2/auth.route");

const router = express.Router();

const routes = [
  {
    path: "/user",
    route: userRouter,
  },
  {
    path: "/auth",
    route: authRouter,
  },
];

routes.forEach((route) => router.use(route.path, route.route));

module.exports = router;
