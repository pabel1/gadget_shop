const mongoose = require("mongoose");

// product image Schema
const imageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  public_id: {
    type: String,
    required: true,
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
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const ProductModel = mongoose.model("Product", productSchema);

module.exports = ProductModel;
