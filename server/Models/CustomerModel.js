const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    ledger: {
      type: String,
    },
    name: {
      type: String
    },
    address1: {
      type: String,
    },
    mobile: {
      type: Number,
     
    },

    alternateMobile: {
      type: Number
    },
    email: {
      type: String,
      lowercase: true,
    },
    whatsapp: {
      type: Number
    },

    designation: {
      type: String,
    },

    area: {
      type: String,
      required: true,
    },
    beat: [
      {
        areaName: {
          type: String,
        },
      },
    ],

    city: {
      type: String,
    },
    bill: {
      type: String,
    },

    billingType: { type: String, enum: ["Credit", "Cash"] },

    creditLimit: {
      type: Number,
    },
    balance: {
      type: Number,
    },

    totalBalance: { type: Number, default: 0 },
    advanceBalance: { type: Number, default: 0 },
    gstNumber: {
      type: String,
    },
    creditDays: {
      type: String
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Customer", customerSchema);
