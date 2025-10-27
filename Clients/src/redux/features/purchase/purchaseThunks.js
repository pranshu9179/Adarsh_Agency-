// src/redux/purchase/purchaseThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../Config/axios";

const API_URL = "/purchase";

const getError = (err) => err.response?.data?.error || err.message;

// ➕ Create purchase (stock is auto-updated by backend)
export const createPurchase = createAsyncThunk(
  "purchase/createPurchase",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(API_URL, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(getError(err));
    }
  }
);

// 📋 Get all purchases
export const fetchPurchases = createAsyncThunk(
  "purchase/fetchPurchases",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(API_URL);
      return res.data;
    } catch (err) {
      return rejectWithValue(getError(err));
    }
  }
);

// 🆔 Get single purchase by ID
export const fetchPurchaseById = createAsyncThunk(
  "purchase/fetchPurchaseById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(getError(err));
    }
  }
);

// 🔧 Update purchase
export const updatePurchase = createAsyncThunk(
  "purchase/updatePurchase",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${API_URL}/${id}`, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(getError(err));
    }
  }
);

// 🗑️ Delete purchase
export const deletePurchase = createAsyncThunk(
  "purchase/deletePurchase",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(getError(err));
    }
  }
);

// 🔢 Get next entry number
export const fetchNextEntryNumber = createAsyncThunk(
  "purchase/fetchNextEntryNumber",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/next-entry-number`);
      return res.data.nextEntryNumber;
    } catch (err) {
      return rejectWithValue(getError(err));
    }
  }
);

// 🔢 Get balance
export const getBalance = createAsyncThunk(
  "purchase/getBalance",
  async (vendorId, { rejectWithValue }) => {
    console.log("sourabh", vendorId);
    try {
      const response = await axios.get(`${API_URL}/get-balance/${vendorId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching balance"
      );
    }
  }
);

// ✅ NEW — Adjust vendor direct (New Ref)
export const adjustVendorDirect = createAsyncThunk(
  "purchase/adjustVendorDirect",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/adjust-vendor-direct`, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(getError(err));
    }
  }
);

// ✅ NEW — Clear all pending vendor purchase bills
export const clearVendorPending = createAsyncThunk(
  "purchase/clearVendorPending",
  async (vendorId, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/clear-vendor-pending`, {
        vendorId,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(getError(err));
    }
  }
);

// 🧾 Pay Against Selected Purchase Bill
export const payAgainstPurchase = createAsyncThunk(
  "purchase/payAgainstPurchase",
  async ({ purchaseId, amount }, { rejectWithValue }) => {
    try {
      const res = await axios.post("/purchase/pay-against-purchase", {
        purchaseId,
        amount,
      });
      return res.data; // { message, paidAmount, updatedPurchase }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Error paying against purchase"
      );
    }
  }
);
