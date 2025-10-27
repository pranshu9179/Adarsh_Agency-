const express = require("express");
const router = express.Router();
const customerController = require("../Controller/CustomerCtrl");

router.post("/", customerController.createCustomer);
router.get("/", customerController.getAllCustomers);
router.get("/beats", customerController.getAllBeats);
router.get("/invoice", customerController.getAllCustomerBill);
router.get("/:id", customerController.getCustomerById);
router.put("/:id", customerController.updateCustomer);
router.put("/balance/:id", customerController.updateCustomerBalanced);
router.delete("/:id", customerController.deleteCustomer);
router.put("/advanced/:id", customerController.updateCustomerAdvanced);

module.exports = router;
