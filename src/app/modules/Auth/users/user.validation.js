const Joi = require("joi");

const userJoiSchema = Joi.object({
  fullname: Joi.string().required().messages({
    "any.required": "Please enter Your Name",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Invalid Email",
    "any.required": "Email is required",
  }),
  password: Joi.string().required().messages({
    "any.required": "Password is required",
  }),
  photo: Joi.object({
    public_id: Joi.string(),
    url: Joi.string(),
  }),
  phone: Joi.string().length(11).trim().messages({
    "string.length": "Phone number must be 11 digits",
  }),
  gender: Joi.string().valid("Male", "Female", "Others"),
  userStatus: Joi.string()
    .valid("Active", "Block", "Restricted")
    .default("Active"),
  role: Joi.string().valid("user", "admin").default("user"),
});

module.exports = userJoiSchema;
