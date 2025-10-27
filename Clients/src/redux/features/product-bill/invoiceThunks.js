// pro-billing
// src/redux/invoice/invoiceThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../Config/axios";

const API_URL = "/pro-billing";

// Utility for error messaging
const getError = (err) =>
  err.response?.data?.error || err.response?.data?.message || err.message;

// ➕ Create an invoice
export const createInvoice = createAsyncThunk(
  "invoice/createInvoice",
  async (invoiceData, { rejectWithValue }) => {
    console.log(invoiceData);

    try {
      const res = await axios.post(API_URL, invoiceData);
      return res.data.invoice;
    } catch (err) {
      return rejectWithValue(getError(err));
    }
  }
);
// ✏️ Update an invoice
export const updateInvoice = createAsyncThunk(
  "invoice/updateInvoice",
  async ({ id, invoiceData }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${API_URL}/${id}`, invoiceData);
      return res.data.invoice;
    } catch (err) {
      return rejectWithValue(getError(err));
    }
  }
);

// 📥 Fetch all invoices
export const fetchInvoices = createAsyncThunk(
  "invoice/fetchInvoices",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(API_URL);
      return res.data;
    } catch (err) {
      return rejectWithValue(getError(err));
    }
  }
);

// 🗑️ Delete an invoice
export const deleteInvoice = createAsyncThunk(
  "invoice/deleteInvoice",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(getError(err));
    }
  }
);

// 📄 Fetch invoice by ID
export const fetchInvoiceById = createAsyncThunk(
  "invoice/fetchInvoiceById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(getError(err));
    }
  }
);

// 👇 Thunk to get invoices by customer ID or Name
export const fetchInvoicesByCustomer = createAsyncThunk(
  "invoice/fetchInvoicesByCustomer",
  async (customerIdOrName, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/customer/${customerIdOrName}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ✅ Get total balance by customer
export const fetchBalanceByCustomer = createAsyncThunk(
  "invoice/fetchBalanceByCustomer",
  async (customerId, thunkAPI) => {
    try {
      const response = await axios.get(
        `${API_URL}/balance/customer/${customerId}`
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch balance"
      );
    }
  }
);

export const fetchInvoicesBySalesman = createAsyncThunk(
  "salesmanInvoices/fetchBySalesman",
  async (salesmanId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/by-salesman/${salesmanId}`);
      return res.data; // backend response me `invoices` array hai
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// ✅ Get invoices by Beat (Area)
export const fetchInvoicesByBeat = createAsyncThunk(
  "invoice/fetchInvoicesByBeat",
  async ({ beatId, beatName }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/by-beat?beatId=${beatId}&beatName=${encodeURIComponent(
          beatName
        )}`
      );

      console.log(response.data, "thunk");
      return response.data; // backend returns { invoices: [...] }
    } catch (error) {
      console.error("[fetchInvoicesByBeat] Error:", error);
      return rejectWithValue(
        error.response?.data?.message || error.message || "Something went wrong"
      );
    }
  }
);
