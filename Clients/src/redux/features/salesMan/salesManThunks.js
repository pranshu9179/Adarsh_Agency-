// src/redux/salesman/salesmanThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../Config/axios";

const API_URL = "/salesman";

// ➕ Create Salesman
export const createSalesman = createAsyncThunk(
  "salesman/createSalesman",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.post(API_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create salesman"
      );
    }
  }
);

// 📥 Get all Salesmen
export const fetchSalesmen = createAsyncThunk(
  "salesman/fetchSalesmen",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(API_URL);
      return res.data.Data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch salesmen"
      );
    }
  }
);

// 📥 Get single Salesman
export const fetchSalesmanById = createAsyncThunk(
  "salesman/fetchSalesmanById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch salesman"
      );
    }
  }
);

// ✏️ Update Salesman
export const updateSalesman = createAsyncThunk(
  "salesman/updateSalesman",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${API_URL}/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.salesman;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update salesman"
      );
    }
  }
);

// ❌ Delete Salesman
export const deleteSalesman = createAsyncThunk(
  "salesman/deleteSalesman",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete salesman"
      );
    }
  }
);
