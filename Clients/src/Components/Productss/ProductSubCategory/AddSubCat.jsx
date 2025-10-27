import React, { useEffect, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { FaPlus, FaTrash, FaPaperclip, FaCheck } from "react-icons/fa";
import axios from "../../../Config/axios";

const AddSubCat = () => {
  const [subCat, setSubCat] = useState("");
  const [company, setCompany] = useState("");
  const [category, setCategory] = useState("");
  const [companies, setCompanies] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const res = await axios.get("/company");
      setCompanies(res.data);
    } catch (err) {
      console.error("Failed to load companies", err);
    }
  };

  useEffect(() => {
    if (company) {
      fetchCategoriesByCompany(company);
    } else {
      setCategories([]); // clear categories if no company selected
    }
  }, [company]);

  const fetchCategoriesByCompany = async (companyId) => {
    try {
      const res = await axios.get(`/category?company=${companyId}`);
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to load categories", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!subCat || !company || !category) {
      alert("Please fill all fields.");
      return;
    }

    try {
      const payload = { subCat, company, category };
      const res = await axios.post("/Subcategory", payload);
      console.log(res);
      alert("SubCategory created successfully!");
      // reset
      setSubCat("");
      setCompany("");
      setCategory("");
    } catch (err) {
      console.error("Creation failed", err);
      alert("Failed to create SubCategory.");
    }
  };

  return (
    <div className="">
      <div className="card shadow-lg">
        <div className="card-header bg-primary text-white">
          <h3 className="card-title">Create Product Sub Category</h3>
          <div className="card-tools">
            <button
              type="button"
              className="btn btn-tool"
              data-card-widget="collapse"
            >
              <i className="fas fa-minus"></i>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div>
            <label>Company:</label>
            <select
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
            >
              <option value="">-- Select Company --</option>
              {companies.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Category:</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              disabled={!company}
            >
              <option value="">-- Select Category --</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>SubCategory Name:</label>
            <input
              type="text"
              value={subCat}
              onChange={(e) => setSubCat(e.target.value)}
              required
            />
          </div>

          <button type="submit" style={{ marginTop: "10px" }}>
            Create
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddSubCat;
