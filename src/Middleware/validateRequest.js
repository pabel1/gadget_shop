const validateRequest = (schema) => async (req, res, next) => {
  try {
    if (req.body.subCategory) {
      req.body.subCategory = JSON.parse(req.body.subCategory);
    }
    await schema.validateAsync(req.body);

    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports = validateRequest;
