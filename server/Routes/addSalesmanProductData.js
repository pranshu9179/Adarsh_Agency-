const express = require("express");

const Invoice = require("../Models/BillingModel");
const Salesman = require("../Models/SalesManModel");
const Customer = require("../Models/CustomerModel");
const Product = require("../Models/ProductModel.js");
const Ledger = require("../Models/LedgerModel.js");
const router = express.Router();

router.post("/additem", async (req, res) => {
  try {
    const { formData, products } = req.body;
    // console.log(req.body);

    console.log(formData);
    console.log(products);

    // find related customer
    const customerData = await Customer.findById(formData.shop);
    if (!customerData) {
      return res
        .status(404)
        .json({ message: "Customer not found", status: false });
    }

    // find related salesman
    const salesmanData = await Salesman.findById(formData.salesmanId);
    if (!salesmanData) {
      return res
        .status(404)
        .json({ message: "Salesman not found", status: false });
    }

    const mappedProducts = products.map((p) => ({
      productId: p.productId || null,
      itemName: p.itemName,
      unit: p.unit,
      primaryUnit: p.primaryUnit,
      secondaryUnit: p.secondaryUnit,
      qty: p.qty,
      Free: p.freeQty,
      rate: p.rate,
      sch: p.sch,
      schAmt: p.schAmt,
      cd: p.cd,
      cdAmt: p.cdAmt,
      total: p.total,
      gst: p.GST,
      totalGstAmount: p.totalGstAmount,
      amount: p.amount,
      finalAmount: p.finalAmount,
      pendingAmount: p.pendingAmount,
      availableQty: p.availableQty,
    }));

    // Calculate invoice total
    const totalFinalAmount = mappedProducts.reduce(
      (sum, p) => sum + (p.finalAmount || 0),
      0
    );

    // ✅ Create invoice with embedded customer info
    const newInvoice = new Invoice({
      companyId: formData.companyId,
      salesmanId: formData.salesmanId,
      customerId: formData.shop,
      salesmanName: salesmanData.name,
      customerName: customerData.name,

      customer: {
        CustomerName: customerData.name,
        Billdate: formData.billDate,
        paymentMode: formData.paymentMode,
        salesmanName: salesmanData.name,
        selectedBeatId: customerData.beatId,
        selectedBeatName: customerData.beatName,
        selectedCustomerId: customerData._id,
        selectedSalesmanId: salesmanData._id,
        billingType: formData.billType,
      },

      billingType: formData.billType,
      billDate: formData.billDate,
      paymentMode: formData.paymentMode,

      billing: mappedProducts,

      finalAmount: totalFinalAmount,
      pendingAmount: totalFinalAmount, // initially full pending
    });

    await newInvoice.save();

    customerData.totalBalance += totalFinalAmount;
    await customerData.save();

    const ledger = new Ledger({
      refType: "invoice",
      refId: newInvoice._id,
      narration: `Invoice created for customer ${customerData.name}`,
      debitAccount: `Customer: ${customerData.name}`,
      creditAccount: "Sales Income",
      amount: totalFinalAmount,
      companyId: newInvoice.companyId,
      customerId: customerData._id,
    });

    await ledger.save();

    newInvoice.ledgerIds.push(ledger._id);
    await newInvoice.save();

    for (const item of mappedProducts) {
      console.log(item);

      if (!item.productId) {
        throw new Error(`Product ID missing`);
      }

      const totalQtyToDeduct = (item.qty || 0) + (item.freeQty || 0);
      const product = await Product.findById(item.productId);

      if (!product) throw new Error(`Product not found: ${item.productId}`);

      if (product.availableQty < totalQtyToDeduct) {
        throw new Error(
          `Not enough stock for ${product.productName}. Available: ${product.availableQty}, Required: ${totalQtyToDeduct}`
        );
      }

      product.availableQty -= totalQtyToDeduct;
      product.lastUpdated = new Date();
      await product.save();
    }

    res.status(201).json({
      message: "Invoice saved successfully",
      data: newInvoice,
      status: true,
    });
  } catch (error) {
    console.error("Error saving invoice:", error);
    res.status(500).json({
      message: "Server error while saving invoice",
      status: false,
    });
  }
});

module.exports = router;
