const Invoice = require("../Models/BillingModel");
const Customer = require("../Models/CustomerModel");
const Ledger = require("../Models/customerLedger");

// CREATE NEW INVOICE ✅
exports.createInvoice = async (req, res) => {
  try {
    const {
      companyId,
      salesmanId,
      customerId,
      billingType,
      billing,
      finalAmount,
      paymentMode,
    } = req.body;

    if (!customerId) {
      return res.status(400).json({ message: "Customer ID is required" });
    }

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Calculate pending amount (full bill for now)
    const pendingAmount = finalAmount;

    // Create invoice
    const invoice = new Invoice({
      companyId,
      salesmanId,
      customerId,
      billingType,
      billDate: new Date(),
      paymentMode,
      billing,
      finalAmount,
      pendingAmount,
      status: "open",
    });

    await invoice.save();

    // Update Customer total balance
    customer.totalBalance += pendingAmount;
    await customer.save();

    // Create Ledger entry: Debit Customer, Credit Sales
    const ledger = new Ledger({
      refType: "invoice",
      refId: invoice._id,
      narration: `Invoice created for customer ${customer.name}`,
      debitAccount: `Customer: ${customer.name}`,
      creditAccount: "Sales Income",
      amount: finalAmount,
      companyId,
      customerId,
    });

    await ledger.save();

    // Link ledger to invoice
    invoice.ledgerIds.push(ledger._id);
    await invoice.save();

    res.status(201).json({ message: "Invoice created successfully", invoice });
  } catch (error) {
    console.error("Error creating invoice:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ADJUST PAYMENT ✅
exports.adjustPayment = async (req, res) => {
  try {
    const { invoiceId, paymentAmount, paymentMode } = req.body;

    if (!invoiceId || !paymentAmount) {
      return res
        .status(400)
        .json({ message: "Invoice ID & payment amount required" });
    }

    const invoice = await Invoice.findById(invoiceId).populate("customerId");
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    const customer = await Customer.findById(invoice.customerId);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    let remainingPayment = paymentAmount;

    // Calculate how much settles the invoice
    if (remainingPayment >= invoice.pendingAmount) {
      remainingPayment -= invoice.pendingAmount;
      invoice.pendingAmount = 0;
      invoice.status = "cleared";
    } else {
      invoice.pendingAmount -= remainingPayment;
      invoice.status = invoice.pendingAmount > 0 ? "partial" : "cleared";
      remainingPayment = 0;
    }

    // Add overpayment to customer advanceBalance
    if (remainingPayment > 0) {
      customer.advanceBalance += remainingPayment;
    }

    // Decrease customer's total balance by paymentAmount
    customer.totalBalance -= paymentAmount;
    if (customer.totalBalance < 0) customer.totalBalance = 0;

    // Add payment record to invoice
    invoice.payments.push({
      amount: paymentAmount,
      mode: paymentMode || "Cash",
    });

    // Add adjustment record
    invoice.adjustments.push({
      type: "adj_ref",
      amount: paymentAmount,
      note: "Payment adjustment",
    });

    // Create Ledger: Debit Bank/Cash, Credit Customer
    const ledger = new Ledger({
      refType: "adjustment",
      refId: invoice._id,
      narration: `Payment received for invoice`,
      debitAccount: paymentMode || "Cash",
      creditAccount: `Customer: ${customer.name}`,
      amount: paymentAmount,
      companyId: invoice.companyId,
      customerId: customer._id,
    });

    await ledger.save();

    invoice.ledgerIds.push(ledger._id);

    await invoice.save();
    await customer.save();

    res
      .status(200)
      .json({ message: "Payment adjusted successfully", invoice, customer });
  } catch (error) {
    console.error("Error adjusting payment:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// OPTIONAL: APPLY ADVANCE ON NEW INVOICE ✅
exports.applyAdvance = async (req, res) => {
  try {
    const { invoiceId } = req.body;

    const invoice = await Invoice.findById(invoiceId).populate("customerId");
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    const customer = await Customer.findById(invoice.customerId);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    let advanceToApply = Math.min(
      invoice.pendingAmount,
      customer.advanceBalance
    );

    if (advanceToApply > 0) {
      invoice.pendingAmount -= advanceToApply;
      customer.advanceBalance -= advanceToApply;

      // If invoice fully settled, mark cleared
      if (invoice.pendingAmount === 0) {
        invoice.status = "cleared";
      } else {
        invoice.status = "partial";
      }

      // Adjustment record
      invoice.adjustments.push({
        type: "new_ref",
        amount: advanceToApply,
        note: "Advance auto-applied",
      });

      // Ledger entry
      const ledger = new Ledger({
        refType: "adjustment",
        refId: invoice._id,
        narration: `Advance auto-applied`,
        debitAccount: "Advance",
        creditAccount: `Customer: ${customer.name}`,
        amount: advanceToApply,
        companyId: invoice.companyId,
        customerId: customer._id,
      });

      await ledger.save();
      invoice.ledgerIds.push(ledger._id);

      await invoice.save();
      await customer.save();
    }

    res
      .status(200)
      .json({ message: "Advance applied if available", invoice, customer });
  } catch (error) {
    console.error("Error applying advance:", error);
    res.status(500).json({ message: "Server error" });
  }
};
