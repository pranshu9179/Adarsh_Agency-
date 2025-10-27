// models/Vendor.js
const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema({
  firm: {
    type: String,
    required: true,
  },
  name: String,
  designation: String,
  mobile: Number,
  alternateMobile: Number,
  email: String,
  whatsapp: Number,
  city: String,
  address: String,
  gstNumber: {
    type: String,
  },

  totalBalance: { type: Number, default: 0 }, // Outstanding across all bills
  advanceBalance: { type: Number, default: 0 }, // Overpayment stored here
  address: String,
});

module.exports = mongoose.model("Vendor", vendorSchema);
