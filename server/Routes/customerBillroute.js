// routes/invoiceRoutes.js
const express = require("express");
const router = express.Router();
const invoiceController = require("../Controller/CustomerBill.ctrl");

router.post("/create", invoiceController.createInvoice);
router.post("/adjust-payment", invoiceController.adjustPayment);
router.post("/apply-advance", invoiceController.applyAdvance);

module.exports = router;
