const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },

  productName: { type: String },
  productImg: {
    type: String,
  },
  primaryUnit: String,
  secondaryUnit: String,
  primaryPrice: Number,
  secondaryPrice: Number,
  unit: { type: String }, // New field for Unit dropdown
  mrp: { type: Number }, // New MRP field
  salesRate: { type: Number }, // New Sales Rate field
  purchaseRate: { type: Number }, // New Purchase Rate field

  availableQty: {
    type: Number,
    default: 0,
    immutable: function () {
      return this.isNew;
    },
  }, // can't edit

  hsnCode: { type: String },
  gstPercent: { type: Number, default: 0 },

  lastUpdated: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Product", productSchema);

// categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
// subCategoryId: { type: mongoose.Schema.Types.ObjectId, ref: "SubCategory" },
// primaryUnit: String,
// primaryQty: Number,
// secondaryUnit: String,
// secondaryQty: Number,
// primaryPrice: Number,
// secondaryPrice: Number,
