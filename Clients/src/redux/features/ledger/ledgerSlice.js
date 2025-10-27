// ledgerSlice.js

import { createSlice } from "@reduxjs/toolkit";
import { fetchLedgerByCustomer, fetchLedgerByVendor } from "./ledgerThunk";

const ledgerSlice = createSlice({
  name: "ledger",
  initialState: {
    customerLedger: [],
    vendorLedger: [],
    loading: false,
    error: null,
  },
  reducers: {
    // add non-async reducers if needed
    clearLedger(state) {
      state.customerLedger = [];
      state.vendorLedger = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // ✅ Customer Ledger
    builder
      .addCase(fetchLedgerByCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLedgerByCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.customerLedger = action.payload;
      })
      .addCase(fetchLedgerByCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch customer ledger";
      });

    // ✅ Vendor Ledger
    builder
      .addCase(fetchLedgerByVendor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLedgerByVendor.fulfilled, (state, action) => {
        state.loading = false;
        state.vendorLedger = action.payload;
      })
      .addCase(fetchLedgerByVendor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch vendor ledger";
      });
  },
});

export const { clearLedger } = ledgerSlice.actions;
export default ledgerSlice.reducer;
