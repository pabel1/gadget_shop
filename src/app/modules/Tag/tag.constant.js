const compositeKeyFor = ["tag"];

const tagCompositConstant = {
  compositeKeyFor,
};

const tagsFilterableFields = [
  "categoryName",
  "categoryTag",
  "slug",
  "searchTerm",
  "discount",
  "_id",
];

const tagsSearchableFields = ["categoryName", "categoryTag", "slug"];

module.exports = tagConstant;
const tagConstant = {
  tagCompositConstant,
  tagsFilterableFields,
  tagsSearchableFields,
};
module.exports = tagConstant;
