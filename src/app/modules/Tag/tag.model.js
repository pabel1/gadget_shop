const mongoose = require("mongoose");
const {
  compositeKeyGenerator,
} = require("../../../Helper/compositeKeyGenerator");

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
// generate compositeKey
// tagSchema.pre("save", function (next) {
//     const conpositeKey= compositeKeyGenerator.generateCompositKey({keyFor:})
//     next();
//   });
const TagModel = mongoose.model("tag", tagSchema);

module.exports = TagModel;
