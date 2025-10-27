const express = require("express");
const router = express.Router();
const Ledger = require("../Controller/ledger.controller");

router.get("/next-vendor-voucher-number", Ledger.getNextVendorVoucherNumber);

router.get("/:vendorId", Ledger.getLedgerByVendor);

module.exports = router;
