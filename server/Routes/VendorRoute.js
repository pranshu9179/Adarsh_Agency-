const express = require("express");
const router = express.Router();
const vendorCtrl = require("../Controller/vendorCtrl");

// Create a new vendor
router.post("/", vendorCtrl.createVendor);
// Get all vendors
router.get("/", vendorCtrl.getallVendors);

// vendor bills
router.get("/vendor/:vendorId", vendorCtrl.getBillsByVendorId);

// Get a vendor by ID
router.get("/:id", vendorCtrl.getVendorById);
// Update a vendor by ID
router.put("/:id", vendorCtrl.updateVendor);
// Delete a vendor by ID
router.delete("/:id", vendorCtrl.deleteVendor);

module.exports = router;
