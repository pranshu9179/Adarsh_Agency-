const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  cat: {
    type: String,
    required: true,
    trim: true,
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company", // Reference to Company model
    required: true,
  },
});

module.exports = mongoose.model("Category", categorySchema);
