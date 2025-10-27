// src/redux/category/categoryThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "/api/category";

const getErrorMessage = (error) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.error || error.message;
  }
  return error.message;
};

// 🔹 Get all categories (optionally filtered by company ID)
export const fetchCategories = createAsyncThunk(
  "category/fetchCategories",
  async (companyId, { rejectWithValue }) => {
    try {
      const url = companyId ? `${API_URL}?company=${companyId}` : API_URL;
      const res = await axios.get(url);
      return res.data;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

// 🔹 Get category by ID
export const fetchCategoryById = createAsyncThunk(
  "category/fetchCategoryById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

// 🔹 Create new category
export const createCategory = createAsyncThunk(
  "category/createCategory",
  async (categoryData, { rejectWithValue }) => {
    try {
      const res = await axios.post(API_URL, categoryData);
      return res.data;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

// 🔹 Update category by ID
export const updateCategory = createAsyncThunk(
  "category/updateCategory",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${API_URL}/${id}`, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

// 🔹 Delete category by ID
export const deleteCategory = createAsyncThunk(
  "category/deleteCategory",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      return { id };
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);
