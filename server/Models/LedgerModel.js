const mongoose = require("mongoose");

const vendorLedgerSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  voucherNumber: {
    type: String,
    unique: true,
    // required: true,
  },

  refType: {
    type: String,
    enum: [
      "invoice",
      "payment",
      "adjustment",
      "clear_ref",
      "invoice_payment",
      "new_ref",
      "purchase",
      "purchase_payment",
      "adj_ref",
    ],
    required: true,
  },

  refId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },

  narration: String,

  debitAccount: {
    type: String,
    required: true,
  },

  creditAccount: {
    type: String,
    required: true,
  },

  debit: {
    type: Number,
    default: 0,
  },

  credit: {
    type: Number,
    default: 0,
  },

  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
  },

  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
  },

  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// ✅ Pre-save hook for voucherNumber
vendorLedgerSchema.pre("save", async function (next) {
  if (!this.voucherNumber) {
    try {
      const VendorLedger = mongoose.model("Ledger");
      const lastEntry = await VendorLedger.findOne().sort({ createdAt: -1 });

      let nextNumber = 1;
      if (lastEntry && lastEntry.voucherNumber) {
        const lastNo = parseInt(lastEntry.voucherNumber.split("/")[2]);
        nextNumber = lastNo + 1;
      }

      const now = new Date();
      const fy =
        now.getMonth() + 1 >= 4
          ? `${String(now.getFullYear()).slice(2)}-${String(
              now.getFullYear() + 1
            ).slice(2)}`
          : `${String(now.getFullYear() - 1).slice(2)}-${String(
              now.getFullYear()
            ).slice(2)}`;

      this.voucherNumber = `VL/${fy}/${String(nextNumber).padStart(4, "0")}`;

      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});

module.exports = mongoose.model("Ledger", vendorLedgerSchema);
