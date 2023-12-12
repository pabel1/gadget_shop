const productFilterableFields = [
  "productName",
  "productPrice",
  "category",
  "subCategory",
  "productTags",
  "rating",
];

const productSearchableFields = [
  "productName",
  "productPrice",
  "category",
  "subCategory",
  "productTags",
  "rating",
];
const imageUploadFields = ["product_image"];
const parseAbleField = ["category", "subCategory", "productTags"];

const productConstant = {
  productFilterableFields,
  productSearchableFields,
  imageUploadFields,
  parseAbleField,
};
module.exports = productConstant;
