const express = require("express");
const router = express.Router();
const Category = require("../Models/ProCategoryModel");
const Company = require("../Models/CompanyModel");

// ➕ Create a new Category
router.post("/", async (req, res) => {
  try {
    const { cat, company } = req.body;

    // Check if company exists
    const companyExists = await Company.findById(company);
    if (!companyExists) {
      return res.status(404).json({ error: "Company not found" });
    }

    const newCategory = new Category({ cat, company });
    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 📄 Get all Categories with company info// GET /api/category?company=companyId// 📄 Get all Categories with company name
router.get("/", async (req, res) => {
  try {
    const { company } = req.query;

    let filter = {};
    if (company) {
      filter.company = company;
    }

    const categories = await Category.find(filter).populate("company", "name");
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📄 Get a Category by ID
router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate(
      "company",
      "name"
    );
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✏️ Update a Category
router.put("/:id", async (req, res) => {
  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json(updatedCategory);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ❌ Delete a Category
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
