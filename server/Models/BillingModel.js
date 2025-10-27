const mongoose = require("mongoose");

const BillingItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" }, // Reference only
  itemName: String,
  unit: String,
  qty: Number,
  Free: Number,
  rate: Number,
  sch: Number,
  schAmt: Number,
  cd: Number,
  cdAmt: Number,
  total: Number,
  gst: Number,
  amount: Number,
});

const CustomerInfoSchema = new mongoose.Schema({
  CustomerName: String,
  Billdate: Date,
  paymentMode: String,
  salesmanName: String,
  selectedBeatId: { type: mongoose.Schema.Types.ObjectId, ref: "Beat" },
  selectedBeatName: String,
  selectedCustomerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
  selectedSalesmanId: { type: mongoose.Schema.Types.ObjectId, ref: "Salesman" },
  billingType: String,
});

const InvoiceSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
  salesmanId: { type: mongoose.Schema.Types.ObjectId, ref: "Salesman" },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  salesmanName: String,

  customerName: String,
  customer: CustomerInfoSchema, // ✅ Embedded
  // billingType: { type: String, enum: ["Cash", "Credit"], required: true },
  billingType: {
    type: String,
    enum: ["Cash", "Credit", "cash", "credit"],
    required: true,
  },

  billDate: { type: Date, default: Date.now },
  paymentMode: String,

  billing: [BillingItemSchema],

  finalAmount: { type: Number, default: 0 }, // Bill total
  pendingAmount: { type: Number, default: 0 }, // What is still unpaid

  status: {
    type: String,
    enum: ["open", "partial", "cleared"],
    default: "open",
  },

  adjustments: [
    {
      type: { type: String, enum: ["new_ref", "adj_ref", "clear_ref"] },
      amount: Number,
      date: { type: Date, default: Date.now },
      note: String,
    },
  ],

  payments: [
    {
      amount: Number,
      date: { type: Date, default: Date.now },
      mode: String,
      txnId: String,
    },
  ],

  ledgerIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Ledger" }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Invoice", InvoiceSchema);



