const Joi = require("joi");

const imageSchema = Joi.object({
  url: Joi.string().required().messages({
    "string.empty": "Image URL is required.",
  }),
  public_id: Joi.string().required().messages({
    "string.empty": "Image public ID is required.",
  }),
});
const createProductValidationSchema = Joi.object({
  productName: Joi.string().required().messages({
    "string.empty": "Product name is required.",
  }),
  productPrice: Joi.number().required().messages({
    "number.base": "Product price must be a number.",
    "number.empty": "Product price is required.",
  }),
  discount: Joi.number().required().messages({
    "number.base": "Discount must be a number.",
    "number.empty": "Discount is required.",
  }),
  productImage: Joi.array().items(imageSchema),
  productDescription: Joi.string().required().messages({
    "string.empty": "Product description is required.",
  }),
  productDetails: Joi.string().required().messages({
    "string.empty": "Product details are required.",
  }),
  category: Joi.array()
    .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/))
    .messages({
      "array.base": "Categories must be an array of valid ObjectId strings.",
    }),
  subCategory: Joi.array()
    .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/))
    .messages({
      "array.base": "Subcategories must be an array of valid ObjectId strings.",
    }),
  productTags: Joi.array()
    .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/))
    .messages({
      "array.base": "Tags must be an array of valid ObjectId strings.",
    }),
  rating: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      "string.pattern.base": "Rating must be a valid ObjectId string.",
    }),
}).options({ abortEarly: false });
const JoiProductValidationSchema = {
  createProductValidationSchema,
};

module.exports = JoiProductValidationSchema;
