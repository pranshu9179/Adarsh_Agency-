// src/redux/vendor/vendorSlice.js
import { createSlice } from "@reduxjs/toolkit";
import {
  createVendor,
  fetchVendors,
  fetchVendorById,
  updateVendor,
  deleteVendor,
  fetchVendorBills, // 👈 NEW
} from "./VendorThunks";

const initialState = {
  vendors: [],
  currentVendor: null,
  vendorBills: [], // 👈 NEW
  loading: false,
  error: null,
};

const vendorSlice = createSlice({
  name: "vendor",
  initialState,
  reducers: {
    clearVendorError(state) {
      state.error = null;
    },
    clearCurrentVendor(state) {
      state.currentVendor = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ➕ Create
      .addCase(createVendor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createVendor.fulfilled, (state, action) => {
        state.loading = false;
        state.vendors.unshift(action.payload);
      })
      .addCase(createVendor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 📄 Fetch All
      .addCase(fetchVendors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVendors.fulfilled, (state, action) => {
        state.loading = false;
        state.vendors = action.payload;
      })
      .addCase(fetchVendors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 📄 Fetch Single
      .addCase(fetchVendorById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVendorById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentVendor = action.payload;
      })
      .addCase(fetchVendorById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✏️ Update
      .addCase(updateVendor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateVendor.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.vendors.findIndex(
          (v) => v._id === action.payload._id
        );
        if (index !== -1) state.vendors[index] = action.payload;
      })
      .addCase(updateVendor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ❌ Delete
      .addCase(deleteVendor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteVendor.fulfilled, (state, action) => {
        state.loading = false;
        state.vendors = state.vendors.filter((v) => v._id !== action.payload);
      })
      .addCase(deleteVendor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 📦 Fetch Vendor Bills
      .addCase(fetchVendorBills.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.vendorBills = [];
      })
      .addCase(fetchVendorBills.fulfilled, (state, action) => {
        state.loading = false;
        state.currentVendor = action.payload.vendor; // optional
        state.vendorBills = action.payload.bills;
      })
      .addCase(fetchVendorBills.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.vendorBills = [];
      });
  },
});

export const { clearVendorError, clearCurrentVendor } = vendorSlice.actions;
export default vendorSlice.reducer;
