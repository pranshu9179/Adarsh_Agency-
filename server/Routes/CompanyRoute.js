const express = require("express");
const router = express.Router();
const Company = require("../Models/CompanyModel");

// ➕ Create a new Company
router.post("/", async (req, res) => {
  try {
    console.log(req.body, "this is post the data in the brand section");

    const newCompany = new Company(req.body);
    const savedCompany = await newCompany.save();
    res.status(201).json(savedCompany);
  } catch (error) {
    console.error("Erroor", error?.message);
    res.status(400).json({ error: error.message });
  }
});

// 📄 Get all Companies
router.get("/", async (req, res) => {
  console.log("this is call");
  try {
    const companies = await Company.find();
    console.log(
      companies,
      "my name is ayan get the data from the company model"
    );

    res.status(200).json(companies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📄 Get a Company by ID
router.get("/:id", async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }
    res.json(company);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✏️ Update a Company by ID
router.put("/:id", async (req, res) => {
  try {
    const updatedCompany = await Company.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedCompany) {
      return res.status(404).json({ error: "Company not found" });
    }
    res.json({ data: updatedCompany, status: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ❌ Delete a Company by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedCompany = await Company.findByIdAndDelete(req.params.id);
    if (!deletedCompany) {
      return res.status(404).json({ error: "Company not found" });
    }
    res.json({ message: "Company deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
