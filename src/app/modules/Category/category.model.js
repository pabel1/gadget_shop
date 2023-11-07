const mongoose = require("mongoose");

const categoriesSchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: true,
      unique: true,
    },
    photo: {
      secure_url: {
        type: String,
        // required: true,
      },
      public_id: {
        type: String,
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

const CategoriesModel = mongoose.model("categories", categoriesSchema);

module.exports = CategoriesModel;
