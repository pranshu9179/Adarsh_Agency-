const mongoose = require("mongoose");
const Purchase = require("../Models/PurchaseModel");
const Product = require("../Models/ProductModel");
const Ledger = require("../Models/LedgerModel");

// ✅ Create New Purchase Entry
// exports.createPurchase = async (req, res) => {
//   try {
//     console.log(req.body, "purcxhase ");
//     let totalAmount = 0;

//     // Calculate total final amount
//     req.body.items.forEach((item) => {
//       totalAmount += parseFloat(item.totalAmount || 0);
//     });

//     const newPurchase = new Purchase({
//       ...req.body,
//       finalAmount: totalAmount,
//       pendingAmount: totalAmount, // initially full amount due
//     });

//     const savedPurchase = await newPurchase.save();

//     // ✅ Ledger Entry: CREDIT => Vendor ko paisa dena hai

//     const ledger = await Ledger.create({
//       vendorId: savedPurchase.vendorId,
//       refId: savedPurchase._id, // ✅ Correct field name
//       refType: "invoice",
//       type: "CREDIT",
//       amount: totalAmount,
//       debitAccount: "Inventory", // ✅ Logical debit side
//       creditAccount: "Accounts Payable", // ✅ Logical credit side
//       narration: `New Purchase created`,
//     });

//     // Link ledgerId to purchase
//     savedPurchase.ledgerIds.push(ledger._id);
//     await savedPurchase.save();

//     // ✅ Update Product stock
//     for (const item of savedPurchase.items) {
//       const product = await Product.findById(item.productId);
//       if (product) {
//         product.availableQty += Number(item.quantity);

//         await product.save();
//       }
//     }

//     res.status(201).json(savedPurchase);
//   } catch (err) {
//     console.error("Error creating purchase:", err.message);
//     res.status(400).json({ message: err.message });
//   }
// };

// server/controllers/purchaseController.js
// const Purchase = require("../models/Purchase");
// const Ledger = require("../models/Ledger");
// const Product = require("../models/Product");

exports.createPurchase = async (req, res) => {
  try {
    console.log(req.body, "purchase");

    // sanitize items: remove companyId if present (we don't use brands anymore)
    const sanitizedItems = (req.body.items || []).map((item) => {
      const clean = { ...item };
      if ("companyId" in clean) {
        delete clean.companyId;
      }
      return clean;
    });

    let totalAmount = 0;
    sanitizedItems.forEach((item) => {
      totalAmount += parseFloat(item.totalAmount || 0);
    });

    const newPurchase = new Purchase({
      vendorId: req.body.vendorId,
      date: req.body.date,
      entryNumber: req.body.entryNumber,
      partyNo: req.body.partyNo,
      items: sanitizedItems,
      finalAmount: totalAmount,
      pendingAmount: totalAmount,
    });

    const savedPurchase = await newPurchase.save();

    // create ledger (credit)
    const ledger = await Ledger.create({
      vendorId: savedPurchase.vendorId,
      refId: savedPurchase._id,
      refType: "invoice",
      type: "CREDIT",
      amount: totalAmount,
      debitAccount: "Inventory",
      creditAccount: "Accounts Payable",
      narration: `New Purchase created`,
    });

    savedPurchase.ledgerIds.push(ledger._id);
    await savedPurchase.save();

    // Update product stock
    for (const item of savedPurchase.items) {
      if (!item.productId) continue;
      const product = await Product.findById(item.productId);
      if (product) {
        product.availableQty =
          (product.availableQty || 0) + Number(item.quantity || 0);
        await product.save();
      }
    }

    res.status(201).json(savedPurchase);
  } catch (err) {
    console.error("Error creating purchase:", err);
    res
      .status(400)
      .json({ message: err.message || "Failed to create purchase" });
  }
};

// ✅ Get All Purchases
exports.getAllPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find()
      .populate("vendorId", "firm name")
      .populate("ledgerIds")
      .populate("items.productId", "productName");
    res.json(purchases);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//fetch purchase bill by id
exports.fetchPurchaseById = async (req, res) => {
  console.log(req.body, "check fetch purchase bill work or not ");

  const { id } = req.body;
  try {
    const purchases = await Purchase.findById({ id })
      .populate("vendorId", "firm name")
      .populate("ledgerIds")
      .populate("items.productId", "productName");
    res.json(purchases);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get Purchase By ID
exports.getPurchaseById = async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id)
      .populate("vendorId", "firm name")
      .populate("ledgerIds")
      .populate("items.productId", "productName");
    if (!purchase) return res.status(404).json({ message: "Not found" });
    res.json(purchase);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Update Purchase
exports.updatePurchase = async (req, res) => {
  try {
    const updated = await Purchase.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
      .populate("vendorId", "firm name")
      .populate("ledgerIds")
      .populate("items.productId", "productName");
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Delete Purchase
exports.deletePurchase = async (req, res) => {
  try {
    await Purchase.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get Next Entry Number
exports.getNextEntryNumber = async (req, res) => {
  try {
    const lastEntry = await Purchase.findOne().sort({ createdAt: -1 });
    let nextEntryNumber = "00001";
    if (lastEntry && lastEntry.entryNumber) {
      const lastNumber = parseInt(lastEntry.entryNumber);
      nextEntryNumber = (lastNumber + 1).toString().padStart(5, "0");
    }
    res.json({ nextEntryNumber });
  } catch (err) {
    res.status(500).json({ message: "Failed to get next entry number" });
  }
};

// ✅ Apply Payment (New Ref) — adjust pending + create DEBIT ledger
exports.adjustNewRef = async (req, res) => {
  try {
    const { vendorId, amount } = req.body;

    if (!vendorId || !amount) {
      return res.status(400).json({ message: "Vendor ID & amount required" });
    }

    let remaining = amount;

    const purchaseEntries = await Purchase.find({
      vendorId,
      pendingAmount: { $gt: 0 },
    }).sort({ date: 1 });

    for (const entry of purchaseEntries) {
      if (remaining <= 0) break;

      const deduct = Math.min(entry.pendingAmount, remaining);

      await Ledger.create({
        vendorId: vendorId,
        refId: entry._id,
        refType: "payment",
        type: "DEBIT",
        amount: deduct,
        debitAccount: "Accounts Payable",
        creditAccount: "Cash",
        narration: `Payment adjusted for purchase #${entry._id}`,
      });

      entry.pendingAmount -= deduct;
      entry.status = entry.pendingAmount === 0 ? "cleared" : "partial";
      remaining -= deduct;

      await entry.save();
    }

    res.json({
      message: "Vendor payment adjusted",
      totalAdjusted: amount - remaining,
      remaining: remaining,
    });
  } catch (err) {
    console.error("Error adjusting vendor payment:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Clear all Vendor Pending Amounts
exports.clearVendorPending = async (req, res) => {
  try {
    const { vendorId } = req.body;

    if (!vendorId) {
      return res.status(400).json({ message: "Vendor ID required" });
    }

    const purchases = await Purchase.find({
      vendorId,
      pendingAmount: { $gt: 0 },
    });

    for (const entry of purchases) {
      // ✅ Clear pending & mark status
      entry.pendingAmount = 0;
      entry.status = "cleared";

      await Ledger.create({
        vendorId: vendorId,
        purchaseId: entry._id,
        refType: "clear_ref",
        type: "DEBIT",
        amount: entry.pendingAmount,
        note: "All dues cleared",
      });

      await entry.save();
    }

    res.json({ message: "All pending cleared for vendor" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get Vendor Total Purchase Balance
exports.getBalanceByVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;

    const result = await Purchase.aggregate([
      {
        $match: {
          vendorId: new mongoose.Types.ObjectId(vendorId),
        },
      },
      {
        $group: {
          _id: "$vendorId",
          balance: { $sum: "$pendingAmount" },
        },
      },
    ]);

    const balance = result[0]?.balance || 0;

    res.json({ balance });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Pay against selected Purchase bill
exports.payAgainstPurchase = async (req, res) => {
  try {
    const { purchaseId, amount } = req.body;

    if (!purchaseId || !amount) {
      return res
        .status(400)
        .json({ message: "Purchase ID & amount are required" });
    }

    const purchase = await Purchase.findById(purchaseId);
    if (!purchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }

    const vendorId = purchase.vendorId;

    const deduction = Math.min(purchase.pendingAmount, amount);

    // ✅ Ledger entry for this payment with all required fields
    const ledger = await Ledger.create({
      vendorId: vendorId,
      refId: purchase._id, // ✅ Must for linking
      refType: "adj_ref",
      debitAccount: "Cash", // Tumhare system ke hisab se Cash ya Bank
      creditAccount: "Vendor", // Vendor side
      debit: deduction,
      credit: 0,
      narration: `Payment received against selected Purchase`,
    });

    // ✅ Update purchase pending amount & status
    purchase.pendingAmount -= deduction;
    purchase.status = purchase.pendingAmount === 0 ? "cleared" : "partial";
    purchase.ledgerIds.push(ledger._id);

    await purchase.save();

    return res.status(200).json({
      message: "Payment adjusted for selected Purchase",
      paidAmount: deduction,
      updatedPurchase: purchase,
    });
  } catch (err) {
    console.error("Error paying against purchase:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};
