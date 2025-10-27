const Vendor = require("../Models/VendorModel");
const Purchase = require("../Models/PurchaseModel");

const createVendor = async (req, res) => {
  try {
    const newVendor = new Vendor(req.body);
    await newVendor.save();
    res.status(201).json(newVendor);
  } catch (error) {
    // console.error("Error creating salesman:", error);
    res.status(400).json({ message: error.message });
  }
};

const getallVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find().sort({ createdAt: -1 });
    res.status(200).json(vendors);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getVendorById = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }
    res.status(200).json(vendor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateVendor = async (req, res) => {
  try {
    const updatedVendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedVendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }
    res.status(200).json(updatedVendor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteVendor = async (req, res) => {
  try {
    const deletedVendor = await Vendor.findByIdAndDelete(req.params.id);
    if (!deletedVendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }
    res.status(200).json({ message: "Vendor deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET /api/purchase/vendor/:vendorId
const getBillsByVendorId = async (req, res) => {
  const { vendorId } = req.params;

  try {
    // Optional: Verify vendor exists
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    // Fetch all purchases (bills) for that vendor
    const purchases = await Purchase.find({
      vendorId,
      pendingAmount: { $ne: 0 },
    }).sort({ date: -1 });

    return res.status(200).json({
      vendor,
      bills: purchases,
    });
  } catch (error) {
    console.error("Error fetching vendor bills:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getBillsByVendorId,
  createVendor,
  getallVendors,
  getVendorById,
  updateVendor,
  deleteVendor,
};
