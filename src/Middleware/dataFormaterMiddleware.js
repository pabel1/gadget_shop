const parseArrayFields = (...fields) => {
  return (req, res, next) => {
    console.log("Request Body:", req.body);
    try {
      fields.forEach((field) => {
        console.log(req.body[field], "6 number line ");
        if (req.body[field]) {
          const fieldValue = JSON.parse(req.body[field]);
          req.body[field] = Array.isArray(fieldValue)
            ? fieldValue
            : [fieldValue];
        }
      });
      console.log(req.body.category);
      next();
    } catch (error) {
      console.error("Error parsing JSON:", error);
      next(error);
    }
  };
};

const dataFormaterMiddleware = {
  parseArrayFields,
};

module.exports = dataFormaterMiddleware;
