const mongoose = require("mongoose");
const tagSchema = new mongoose.Schema(
  {
    tagFor: {
      type: String,
      required: true,
    },
    tagCategory: {
      type: String,
    },
    tagTitle: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },
    tagCompositKey: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const TagModel = mongoose.model("tag", tagSchema);

module.exports = TagModel;
