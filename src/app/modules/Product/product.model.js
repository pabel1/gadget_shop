const mongoose = require("mongoose");
const generateSlug = require("../../../shared/generateSlug");

// product image Schema
const imageSchema = new mongoose.Schema({
  url: {
    type: String,
    // required: true,
  },
  public_id: {
    type: String,
    // required: true,
  },
});
const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    productPrice: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    // brandId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Brand",
    // },

    productImage: [imageSchema],
    productDescription: {
      type: String,
      required: true,
    },
    productDetails: {
      type: String,
      required: true,
    },

    category: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    subCategory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubCategories",
      },
    ],
    productTags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],

    rating: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rating",
    },
    compositeKey: {
      type: String,
      unique: true, // Ensures uniqueness of the composite key
      // required: true,
    },
    slug: {
      type: String,
      // required: true,
      lowercase: true,
      unique: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// composite key created for uniqueness
productSchema.pre("save", function (next) {
  const truncatedName = this.productName.substring(0, 5); // Truncate product name to at most 5 characters
  this.compositeKey = `p-${truncatedName.trim()}-${this.productPrice
    .toString()
    .trim()}`;

  if (this.isModified("productName") || this.isNew) {
    this.slug = generateSlug(this.productName);
  }

  next();
});

const ProductModel = mongoose.model("Product", productSchema);

module.exports = ProductModel;
