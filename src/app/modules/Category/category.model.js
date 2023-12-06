const mongoose = require("mongoose");
const generateSlug = require("../../../shared/generateSlug");

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
    slug: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
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

// Middleware to create a slug before saving
categoriesSchema.pre("save", function (next) {
  // Generate slug only if the categoryName has changed or if it's a new document
  if (this.isModified("categoryName") || this.isNew) {
    this.slug = generateSlug(this.categoryName);
  }
  next();
});

const CategoriesModel = mongoose.model("categories", categoriesSchema);

module.exports = CategoriesModel;
