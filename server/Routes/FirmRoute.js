const express = require("express");
const router = express.Router();
const Firm = require("../Models/FirmModel");

// ➕ Create a new Firm
router.post("/", async (req, res) => {
  try {
    const newFirm = new Firm(req.body);
    const savedFirm = await newFirm.save();
    res.status(201).json(savedFirm);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 📄 Get all Firms
router.get("/", async (req, res) => {
  try {
    const firms = await Firm.find();
    res.status(200).json(firms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📄 Get a Company by ID
router.get("/:id", async (req, res) => {
  try {
    const firm = await Firm.findById(req.params.id);
    if (!firm) return res.status(404).json({ error: "Firm not found" });
    res.json(firm);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✏️ Update a Firm by ID
router.put("/:id", async (req, res) => {
  try {
    const updatedFirm = await Firm.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedFirm) return res.status(404).json({ error: "Firm not found" });
    res.json(updatedFirm);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ❌ Delete a Firm by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedFirm = await Firm.findByIdAndDelete(req.params.id);
    if (!deletedFirm) return res.status(404).json({ error: "Firm not found" });
    res.json({ message: "Firm deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
