// routes/invoiceRoutes.js
const express = require("express");
const customerLedger = require("../Models/customerLedger");
const router = express.Router();

router.get("/", async (req, res) => {
  const { customerId, startDate, endDate } = req.query;

  if (!customerId) {
    return res.status(400).json({ message: "Customer ID required" });
  }

  const query = { customerId };
  if (startDate && endDate) {
    query.date = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  const ledger = await customerLedger.find(query).sort({ date: 1 });
  res.json(ledger);
});

router.get("/next-voucher-number", async (req, res) => {
  const last = await customerLedger.findOne().sort({ createdAt: -1 });
  let next = 1;
  if (last && last.voucherNumber) {
    const lastNo = last.voucherNumber.split("/")[2];
    next = parseInt(lastNo) + 1;
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

  const nextVoucher = `CL/${fy}/${String(next).padStart(4, "0")}`;

  res.json({ nextVoucherNumber: nextVoucher });
});

module.exports = router;
