import React, { useEffect, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { FaPlus, FaTrash, FaPaperclip, FaCheck } from "react-icons/fa";
import axios from "../../../Config/axios";

const AddCategory = () => {
  const [cat, setCat] = useState("");
  const [company, setCompany] = useState("");
  const [companies, setCompanies] = useState([]);

  // 🔽 Fetch all companies for dropdown
  const fetchCompanies = async () => {
    try {
      const res = await axios.get("/company");
      setCompanies(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load companies");
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  // ✅ Submit category with company
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/category", {
        cat,
        company,
      });
      console.log(res);
      alert("Category created successfully!");
      setCat("");
      setCompany("");
    } catch (err) {
      console.error(err);
      alert("Error creating category");
    }
  };

  return (
    <div className="">
      <div className="card shadow-lg">
        <div className="card-header bg-primary text-white">
          <h3 className="card-title">Create Product Category</h3>
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
            <label>Select Company:</label>
            <select
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
            >
              <option value="">-- Select Company --</option>
              {companies.map((comp) => (
                <option key={comp._id} value={comp._id}>
                  {comp.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Category Name:</label>
            <input
              type="text"
              value={cat}
              onChange={(e) => setCat(e.target.value)}
              required
            />
          </div>

          <button type="submit">Save Category</button>
        </form>
      </div>
    </div>
  );
};

export default AddCategory;
