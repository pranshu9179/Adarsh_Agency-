// const mongoose = require("mongoose");

// const itemSchema = new mongoose.Schema({
//   productId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Product",
//     required: true,
//   },
//   companyId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Company",
//     required: true,
//   },
//   purchaseRate: Number,
//   quantity: Number,
//   availableQty: Number,
//   totalAmount: Number,
//   purchaseDate: Date,
// });

// const adjustmentSchema = new mongoose.Schema({
//   type: { type: String, enum: ["new_ref", "adj_ref", "clear_ref"] },
//   amount: Number,
//   date: { type: Date, default: Date.now },
//   note: String,
// });

// const paymentSchema = new mongoose.Schema({
//   amount: Number,
//   date: { type: Date, default: Date.now },
//   mode: String,
//   txnId: String,
// });

// const purchaseSchema = new mongoose.Schema(
//   {
//     vendorId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Vendor",
//       required: true,
//     },

//     date: {
//       type: Date,
//       required: true,
//     },

//     entryNumber: {
//       type: String,
//       unique: true,
//       required: true,
//     },

//     partyNo: {
//       type: String,
//       required: true,
//     },
//     companyId: {
//       type: String,
//       // required: true,
//     },

//     // ✅ Final amount and pending amount like invoice
//     finalAmount: {
//       type: Number,
//       default: 0,
//     },

//     pendingAmount: {
//       type: Number,
//       default: 0,
//     },

//     // ✅ Ledger link array
//     ledgerIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Ledger" }],

//     // ✅ Adjustments & payments
//     adjustments: [adjustmentSchema],
//     payments: [paymentSchema],

//     // ✅ Status same as customer invoice
//     status: {
//       type: String,
//       enum: ["open", "partial", "cleared"],
//       default: "open",
//     },

//     items: [itemSchema],
//   },
//   { timestamps: true }
// );

// purchaseSchema.pre("save", async function (next) {
//   if (!this.entryNumber) {
//     try {
//       const lastEntry = await Purchase.findOne().sort({ createdAt: -1 });

//       let newEntryNumber = "00001";
//       if (lastEntry && lastEntry.entryNumber) {
//         const lastNumber = parseInt(lastEntry.entryNumber);
//         const nextNumber = lastNumber + 1;
//         newEntryNumber = nextNumber.toString().padStart(5, "0");
//       }

//       this.entryNumber = newEntryNumber;
//       next();
//     } catch (err) {
//       return next(err);
//     }
//   } else {
//     next();
//   }
// });

// module.exports = mongoose.model("Purchase", purchaseSchema);

// server/models/Purchase.js
const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  purchaseRate: Number,
  quantity: Number,
  availableQty: Number,
  totalAmount: Number,
  purchaseDate: Date,
});

const adjustmentSchema = new mongoose.Schema({
  type: { type: String, enum: ["new_ref", "adj_ref", "clear_ref"] },
  amount: Number,
  date: { type: Date, default: Date.now },
  note: String,
});

const paymentSchema = new mongoose.Schema({
  amount: Number,
  date: { type: Date, default: Date.now },
  mode: String,
  txnId: String,
});

const purchaseSchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    entryNumber: {
      type: String,
      unique: true,
      required: true,
    },

    partyNo: {
      type: String,
      required: true,
    },

    // Final & pending amounts
    finalAmount: {
      type: Number,
      default: 0,
    },

    pendingAmount: {
      type: Number,
      default: 0,
    },

    ledgerIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Ledger" }],

    adjustments: [adjustmentSchema],
    payments: [paymentSchema],

    status: {
      type: String,
      enum: ["open", "partial", "cleared"],
      default: "open",
    },

    items: [itemSchema],
  },
  { timestamps: true }
);

purchaseSchema.pre("save", async function (next) {
  if (!this.entryNumber) {
    try {
      const lastEntry = await Purchase.findOne().sort({ createdAt: -1 });

      let newEntryNumber = "00001";
      if (lastEntry && lastEntry.entryNumber) {
        const lastNumber = parseInt(lastEntry.entryNumber);
        const nextNumber = lastNumber + 1;
        newEntryNumber = nextNumber.toString().padStart(5, "0");
      }

      this.entryNumber = newEntryNumber;
      next();
    } catch (err) {
      return next(err);
    }
  } else {
    next();
  }
});

module.exports = mongoose.model("Purchase", purchaseSchema);
