const express = require("express");
const userRouter = require("../app/modules/Auth/users/user.router");
const googleauthRouter = require("../app/modules/Auth/Oauth2/google.auth.route");
const categoriesRouter = require("../app/modules/Category/category.router");
const subCategoriesRouter = require("../app/modules/SubCategory/subCategories.router");
const productRouter = require("../app/modules/Product/product.router");
const tagRouter = require("../app/modules/Tag/tag.route");

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
  {
    path: "/categories",
    route: categoriesRouter,
  },
  {
    path: "/subcategories",
    route: subCategoriesRouter,
  },
  {
    path: "/product",
    route: productRouter,
  },
  {
    path: "/tag",
    route: tagRouter,
  },
];

routes.forEach((route) => router.use(route.path, route.route));

module.exports = router;
