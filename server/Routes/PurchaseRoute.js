const express = require("express");
const router = express.Router();
const purchaseCtrl = require("../Controller/PurchaseCtrl");

// ✅ Create new purchase
router.post("/", purchaseCtrl.createPurchase);

// ✅ Get all purchases
router.get("/", purchaseCtrl.getAllPurchases);

// ✅ Get next entry number
router.get("/next-entry-number", purchaseCtrl.getNextEntryNumber);

// ✅ Adjust vendor payment (new ref)
router.post("/adjust-vendor-direct", purchaseCtrl.adjustNewRef);

// ✅ Clear all vendor dues
router.post("/clear-vendor-pending", purchaseCtrl.clearVendorPending);

// routes/purchaseRoutes.js
router.post("/pay-against-purchase", purchaseCtrl.payAgainstPurchase);

// ✅ Get vendor total balance (pendingAmount sum)
router.get("/get-balance/:vendorId", purchaseCtrl.getBalanceByVendor);

// ✅ Get vendor ledger balance (debit/credit diff)

// ✅ Get purchase by ID
router.get("/:id", purchaseCtrl.getPurchaseById);

// ✅ Update purchase
router.put("/:id", purchaseCtrl.updatePurchase);

//fetch purchase bill by id
router.get("/fetchPurchaseBillById/:id", purchaseCtrl.fetchPurchaseById);

// ✅ Delete purchase
router.delete("/:id", purchaseCtrl.deletePurchase);

module.exports = router;
