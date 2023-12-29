const parseAbleField = ["subCategory"];
const categoriesParseAbleConstant = {
  parseAbleField,
};

const categoryFilterableFields = [
  "categoryName",
  "categoryTag",
  "slug",
  "searchTerm",
  "discount",
  "_id",
];

const categorySearchableFields = ["categoryName", "categoryTag", "slug"];
const categoriesConstant = {
  categoriesParseAbleConstant,
  categorySearchableFields,
  categoryFilterableFields,
};
module.exports = categoriesConstant;
