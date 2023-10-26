const mongoose = require("mongoose");

const subcategoriesSchema = new mongoose.Schema(
  {
    subcategoryName: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    photo: {
      secure_url: {
        type: String,
      },
      public_id: {
        type: String,
      },
    },

    subcategoryTag: {
      type: String,
    },
    status: {
      type: Boolean,
    },

    product: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const SubcategoriesModel = mongoose.model("subcategories", subcategoriesSchema);

module.exports = SubcategoriesModel;
