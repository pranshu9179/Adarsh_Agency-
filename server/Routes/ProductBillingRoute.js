const express = require("express");
const router = express.Router();
const BillingCtrl = require("../Controller/ProductBillingCtrl");
const protectedRoutes = require("../middleware/auth.middleware");

router.post("/", BillingCtrl.createBilling);
router.get("/", BillingCtrl.getAllInvoices);
router.get("/salesman", protectedRoutes, BillingCtrl.getAllInvoicesBySalesMan);

router.post("/adjust", BillingCtrl.adjustNewRef);
router.post("/new", BillingCtrl.applyNewRef);
router.get("/by-beat", BillingCtrl.getInvoicesByBeat);
router.get("/by-salesman/:salesmanId", BillingCtrl.getInvoicesBySalesman);

router.get("/by-salesman/:salesmanId", BillingCtrl.getInvoicesBySalesman);

router.get("/balance/customer/:customerId", BillingCtrl.getBalanceByCustomer);
router.get("/customer/:customerIdOrName", BillingCtrl.getInvoicesByCustomer);

router.put("/:id", BillingCtrl.updateBilling);
router.get("/:id", BillingCtrl.getInvoiceById);
router.delete("/:id", BillingCtrl.deleteInvoice);

module.exports = router;
