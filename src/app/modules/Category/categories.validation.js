const Joi = require("joi");

const categoriesValidationSchema = Joi.object({
  categoryName: Joi.string().required().messages({
    "string.base": "Category Name must be a string.",
    "string.empty": "Category Name cannot be empty.",
    "any.required": "Category Name is required.",
  }),
  categoriesImage: Joi.object({
    secure_url: Joi.string().required().messages({
      "string.base": "Secure URL must be a string.",
      "string.empty": "Secure URL cannot be empty.",
      "any.required": "Secure URL is required for the image.",
    }),
    public_id: Joi.string().required().messages({
      "string.base": "Public ID must be a string.",
      "string.empty": "Public ID cannot be empty.",
      "any.required": "Public ID is required for the image.",
    }),
  })
    .required()
    .messages({
      "object.base": "Category Image must be an object.",
      "object.empty": "Category Image cannot be empty.",
      "any.required": "Category Image is required.",
    }),
  categoryTag: Joi.string().messages({
    "string.base": "Category Tag must be a string.",
  }),
  discount: Joi.boolean().messages({
    "boolean.base": "Discount must be a boolean.",
  }),
  subCategory: Joi.array().items(Joi.string().guid()).messages({
    "array.base": "SubCategory must be an array.",
    "array.includesRequiredUnknowns": "SubCategory contains invalid values.",
  }),
});
const JoiCategoriesValidationSchema = {
  categoriesValidationSchema,
};

module.exports = JoiCategoriesValidationSchema;
