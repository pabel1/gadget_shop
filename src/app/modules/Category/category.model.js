const mongoose = require("mongoose");

const categoriesSchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: true,
    },
    categoriesImage: {
      url: {
        type: String,
        required: true,
      },
      public_id: {
        type: String,
        required: true,
      },
    },

    categoryTag: {
      type: String,
    },
    discount: {
      type: Boolean,
    },

    subCategory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubCategories",
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const CategoriesSchema = mongoose.model("categories", categoriesSchema);

module.exports = CategoriesSchema;
