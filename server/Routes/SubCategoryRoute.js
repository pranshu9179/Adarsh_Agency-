const express = require("express");
const router = express.Router();
const SubCategory = require("../Models/ProSubCategoryModel");
const Company = require("../Models/CompanyModel");
const Category = require("../Models/ProCategoryModel");

// ➕ Create a new SubCategory
router.post("/", async (req, res) => {
  try {
    const { subCat, company, category } = req.body;

    // Validate company
    const companyExists = await Company.findById(company);
    if (!companyExists) {
      return res.status(404).json({ error: "Company not found" });
    }

    // Validate category
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(404).json({ error: "Category not found" });
    }

    const newSubCategory = new SubCategory({ subCat, company, category });
    const saved = await newSubCategory.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 📄 Get all SubCategories with populated data
router.get("/", async (req, res) => {
  try {
    const subCategories = await SubCategory.find()
      .populate("company", "name")
      .populate("category", "cat");
    res.status(200).json(subCategories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📄 Get a single SubCategory by ID
router.get("/:id", async (req, res) => {
  try {
    const subCategory = await SubCategory.findById(req.params.id)
      .populate("company", "name")
      .populate("category", "cat");

    if (!subCategory) {
      return res.status(404).json({ error: "SubCategory not found" });
    }

    res.json(subCategory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✏️ Update a SubCategory
router.put("/:id", async (req, res) => {
  try {
    const { subCat, company, category } = req.body;

    // Optional: Validate company and category again if needed
    const updated = await SubCategory.findByIdAndUpdate(
      req.params.id,
      { subCat, company, category },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "SubCategory not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ❌ Delete a SubCategory
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await SubCategory.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "SubCategory not found" });
    }
    res.json({ message: "SubCategory deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
