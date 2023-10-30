const Joi = require("joi");

const createTagValidationSchema = Joi.object({
  tagFor: Joi.string().required().messages({
    "any.required": "Tag for is required.",
    "string.base": "Tag for must be a string.",
  }),
  tagCategory: Joi.string().messages({
    "string.base": "Tag category must be a string.",
  }),
  tagTitle: Joi.string().required().messages({
    "any.required": "Tag title is required.",
    "string.base": "Tag title must be a string.",
  }),
  description: Joi.string().messages({
    "string.base": "Description must be a string.",
  }),
});
const JoiTagValidationSchema = {
  createTagValidationSchema,
};

module.exports = JoiTagValidationSchema;
