// ledgerThunk.js

import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../Config/axios";

// ✅ Fetch Ledger by Customer
export const fetchLedgerByCustomer = createAsyncThunk(
  "ledger/fetchByCustomer",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/ledger/${id}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ✅ Fetch Ledger by Vendor (if you have vendors)
export const fetchLedgerByVendor = createAsyncThunk(
  "ledger/fetchByVendor",
  async (vendorId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/ledger/${vendorId}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);
