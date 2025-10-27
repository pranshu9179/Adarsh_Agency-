// src/redux/vendor/vendorThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../Config/axios";

const API_URL = "/vendor"; // Update based on your actual route if needed

const getError = (err) =>
  err.response?.data?.message || err.response?.data?.error || err.message;

// ➕ Create Vendor
export const createVendor = createAsyncThunk(
  "vendor/createVendor",
  async (vendorData, { rejectWithValue }) => {
    try {
      const res = await axios.post(API_URL, vendorData);
      return res.data;
    } catch (err) {
      return rejectWithValue(getError(err));
    }
  }
);

// 📄 Get All Vendors
export const fetchVendors = createAsyncThunk(
  "vendor/fetchVendors",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(API_URL);
      return res.data;
    } catch (err) {
      return rejectWithValue(getError(err));
    }
  }
);

// 📄 Get Single Vendor
export const fetchVendorById = createAsyncThunk(
  "vendor/fetchVendorById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(getError(err));
    }
  }
);

// ✏️ Update Vendor
export const updateVendor = createAsyncThunk(
  "vendor/updateVendor",
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${API_URL}/${id}`, updatedData);
      return res.data;
    } catch (err) {
      return rejectWithValue(getError(err));
    }
  }
);

// ❌ Delete Vendor
export const deleteVendor = createAsyncThunk(
  "vendor/deleteVendor",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(getError(err));
    }
  }
);

export const fetchVendorBills = createAsyncThunk(
  "vendor/fetchVendorBills",
  async (vendorId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/vendor/${vendorId}`);
      return res.data; // { vendor, bills }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch bills"
      );
    }
  }
);
