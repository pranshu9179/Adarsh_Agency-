// src/redux/product/productThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../Config/axios";

const API_URL = "/api/product";

// 📦 Upload with image (form-data)
export const createProduct = createAsyncThunk(
  "product/createProduct",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.post(API_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Create failed");
    }
  }
);

// 📥 Get all products (optional: filter by companyId)
export const fetchProducts = createAsyncThunk(
  "product/fetchProducts",
  async (companyId, { rejectWithValue }) => {
    try {
      const url = companyId ? `${API_URL}?companyId=${companyId}` : API_URL;
      const res = await axios.get(url);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Fetch failed");
    }
  }
);

// 📥 Get product by ID
export const fetchProductById = createAsyncThunk(
  "product/fetchProductById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Not found");
    }
  }
);

// 🔁 Update product (without image)
export const updateProduct = createAsyncThunk(
  "product/updateProduct",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${API_URL}/${id}`, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Update failed");
    }
  }
);

// 📉 Update product quantity
export const updateProductQuantity = createAsyncThunk(
  "product/updateProductQuantity",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/update-product-quantity`, {
        data: { productId, quantity },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Quantity update failed"
      );
    }
  }
);

// ❌ Delete product
export const deleteProduct = createAsyncThunk(
  "product/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      return { id };
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Delete failed");
    }
  }
);
