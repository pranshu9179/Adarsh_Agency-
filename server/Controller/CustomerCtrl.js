const Customer = require("../Models/CustomerModel");
const Invoice = require("../Models/BillingModel");

// CREATE customer
exports.createCustomer = async (req, res) => {
  try {
    const customer = await Customer.create(req.body);
    await customer.save();
    res.status(201).json(customer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// READ all customers
exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ one customer
exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ error: "Customer not found" });
    res.json(customer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateCustomer = async (req, res) => {
  try {
    // If 'beat' is sent in the request, map it to 'beats'
    if (req.body.beat) {
      req.body.beats = req.body.beat.map((b) => b.areaName);
      delete req.body.beat; // Optional: clean up unwanted key
    }

    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.json(customer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

//advance pay
exports.updateCustomerAdvanced = async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    console.log("Request Params:", req.params);

    const { id } = req.params;
    const { pending } = req.body; // pending amount you want to add

    if (!id) {
      return res.status(400).json({ error: "Customer ID is required" });
    }

    if (pending == null) {
      return res.status(400).json({ error: "Pending amount is required" });
    }

    // Find customer by ID
    const customer = await Customer.findById(id);

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    // ✅ Add pending to advanceBalance
    customer.advanceBalance = (customer.advanceBalance || 0) + Number(pending);

    // Save the updated document
    await customer.save();

    res.status(200).json({
      success: true,
      message: "Advance balance updated successfully",
      updatedAdvanceBalance: customer.advanceBalance,
      customer,
    });
  } catch (err) {
    console.error("Error updating customer advance:", err);
    res.status(400).json({ error: err.message });
  }
};

exports.updateCustomerBalanced = async (req, res) => {
  try {
    const { id } = req.params;
    const { data } = req.body; // 'data' = amount to subtract
    console.log(req.body);

    console.log(id);
    console.log(data);

    // Find the customer first
    const customer = await Customer.findById(id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Calculate new balance
    const newBalance = customer.balance - Number(data);

    // Prevent negative balance
    if (newBalance < 0) {
      return res.status(400).json({
        success: false,
        message: "Insufficient balance",
        currentBalance: customer.balance,
      });
    }

    // Update balance
    customer.balance = newBalance;
    await customer.save();

    res.status(200).json({
      success: true,
      message: "Customer balance updated successfully",
      customer,
    });
  } catch (error) {
    console.error("Error updating customer balance:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// DELETE customer
exports.deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) return res.status(404).json({ error: "Customer not found" });
    res.json({ message: "Customer deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllBeats = async (req, res) => {
  try {
    const beats = await Customer.aggregate([
      {
        $match: {
          area: { $exists: true, $ne: null }, // area null नहीं होनी चाहिए
        },
      },
      {
        $group: {
          _id: "$area", // ✅ area ke hisab se group karo
        },
      },
      {
        $project: {
          areaName: "$_id.name", // area ke name
          areaId: "$_id._id", // area ki ID
          _id: 0, // _id remove kar do
        },
      },
    ]);

    res.json({
      message: "Beats fetched successfully",
      count: beats.length,
      beats,
    });
  } catch (err) {
    console.error("getAllBeats error:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getAllCustomerBill = async (req, res) => {
  try {
    console.log("lkjhgfdsa");

    const purchases = await Invoice.find()
      .populate("companyId", "name")
      .populate("salesmanId", "name")
      .populate("customerId", "CustomerName")
      .populate("ledgerIds", "ledgerName") // if applicable
      .populate("billing.productId", "productName unit rate") // nested populate
      // .populate("customer.selectedBeatId", "beatName")
      .populate("customer.selectedCustomerId", "CustomerName")
      .populate("customer.selectedSalesmanId", "name");

    res.json(purchases);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
