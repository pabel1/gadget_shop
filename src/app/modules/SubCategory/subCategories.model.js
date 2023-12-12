const mongoose = require("mongoose");
const generateSlug = require("../../../shared/generateSlug");

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
    slug: {
      type: String,
      lowercase: true,
      unique: true,
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

// Middleware to create a slug before saving
subcategoriesSchema.pre("save", function (next) {
  // Generate slug only if the subcategoryName has changed or if it's a new document
  if (this.isModified("subcategoryName") || this.isNew) {
    this.slug = generateSlug(this.subcategoryName);
  }
  next();
});

const SubcategoriesModel = mongoose.model("subcategories", subcategoriesSchema);

module.exports = SubcategoriesModel;
