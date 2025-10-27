// src/redux/subCategory/subCategoryThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../Config/axios";

const API_URL = "/api/Subcategory";

const getErrorMessage = (err) => {
  if (axios.isAxiosError(err)) {
    return err.response?.data?.error || err.message;
  }
  return err.message;
};

// 🔹 Get all subcategories (with populated company & category)
export const fetchSubCategories = createAsyncThunk(
  "subCategory/fetchSubCategories",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(API_URL);
      return res.data;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

// 🔹 Get subcategory by ID
export const fetchSubCategoryById = createAsyncThunk(
  "subCategory/fetchSubCategoryById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

// 🔹 Create new subcategory
export const createSubCategory = createAsyncThunk(
  "subCategory/createSubCategory",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(API_URL, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

// 🔹 Update subcategory by ID
export const updateSubCategory = createAsyncThunk(
  "subCategory/updateSubCategory",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${API_URL}/${id}`, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

// 🔹 Delete subcategory by ID
export const deleteSubCategory = createAsyncThunk(
  "subCategory/deleteSubCategory",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      return { id };
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);
