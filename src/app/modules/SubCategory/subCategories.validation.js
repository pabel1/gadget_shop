const Joi = require("joi");

const createSubCategoriesValidationSchema = Joi.object({
  subcategoryName: Joi.string().required().messages({
    "string.empty": "Subcategory name is required.",
  }),
  subcategoriesImage: Joi.object({
    secure_url: Joi.string(),
    public_id: Joi.string(),
  }),
  subcategoryTag: Joi.string(),
  status: Joi.boolean(),
  product: Joi.array()
    .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/))
    .messages({
      "array.base": "Products must be an array of valid ObjectId strings.",
    }),
}).options({ abortEarly: false });
const JoiSubCategoriesValidationSchema = {
  createSubCategoriesValidationSchema,
};

module.exports = JoiSubCategoriesValidationSchema;
