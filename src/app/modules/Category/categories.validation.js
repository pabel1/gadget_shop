const Joi = require("joi");

const categoriesValidationSchema = Joi.object({
  categoryName: Joi.string().required().messages({
    "string.base": "Category Name must be a string.",
    "string.empty": "Category Name cannot be empty.",
    "any.required": "Category Name is required.",
  }),
  photo: Joi.object({
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
  }),
  categoryTag: Joi.string().messages({
    "string.base": "Category Tag must be a string.",
  }),
  discount: Joi.boolean().messages({
    "boolean.base": "Discount must be a boolean.",
  }),
  subCategory: Joi.array().items(Joi.string().hex().length(24)).messages({
    "array.base": "Subcategories must be an array.",
    "array.includesRequiredUnknowns":
      "Subcategories must be an array of valid ObjectId strings.",
    "string.hex": "Each element in the array must be a hexadecimal string.",
    "string.length": "Each ObjectId string must be 24 characters long.",
  }),
});
const JoiCategoriesValidationSchema = {
  categoriesValidationSchema,
};

module.exports = JoiCategoriesValidationSchema;
