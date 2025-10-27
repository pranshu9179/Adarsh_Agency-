const mongoose = require("mongoose");

const FirmSchema = new mongoose.Schema({
  name: {
    type: String,
  },

  contactPerson: {
    type: String,
  },

  designation: {
    type: String,
  },

  city: {
    type: String,
  },

  address: {
    type: String,
  },

  mobile: {
    type: String,
  },

  alternateMobile: {
    type: String,
  },

  email: {
    type: String,
    lowercase: true,
  },

  whatsapp: {
    type: String,
  },

  gstNumber: {
    type: String,

    unique: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Firm", FirmSchema);
