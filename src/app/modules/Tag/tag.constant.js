const compositeKeyFor = ["tag"];

const tagCompositConstant = {
  compositeKeyFor,
};

const tagsFilterableFields = [
  "tagFor",
  "categoryTag",
  "tagTitle",
  "tagCompositKey",
  "_id",
];

const tagsSearchableFields = [
  "tagFor",
  "categoryTag",
  "tagTitle",
  "tagCompositKey",
];

const tagConstant = {
  tagCompositConstant,
  tagsFilterableFields,
  
  tagsSearchableFields,
};
module.exports = tagConstant;
