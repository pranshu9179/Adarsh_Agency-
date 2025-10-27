// models/SubCategory.js
const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema({
  subCat: {
    type: String,
    required: true,
    trim: true,
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
});

module.exports = mongoose.model("SubCategory", subCategorySchema);
