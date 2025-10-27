const mongoose = require("mongoose");

const customerLedgerSchema = new mongoose.Schema({
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
    ],
    required: true,
  },

  refId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },

  narration: { type: String },

  debitAccount: {
    type: String,
    // required: true,
  },

  creditAccount: {
    type: String,
    // required: true,
  },

  amount: {
    type: Number,
    required: true,
  },

  oldAmount: {
    type: Number,
  },

  newAmount: {
    type: Number,
  },

  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },

  createdAt: { type: Date, default: Date.now },
});

// ✅ Pre-save hook for voucherNumber
customerLedgerSchema.pre("save", async function (next) {
  if (!this.voucherNumber) {
    try {
      const CustomerLedger = mongoose.model("CustomerLedger");
      const lastEntry = await CustomerLedger.findOne().sort({ createdAt: -1 });

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

      this.voucherNumber = `CL/${fy}/${String(nextNumber).padStart(4, "0")}`;

      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});

module.exports = mongoose.model("CustomerLedger", customerLedgerSchema);
