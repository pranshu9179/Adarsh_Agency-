import { createSlice } from "@reduxjs/toolkit";
import { fetchPurchaseBill, fetchPurchaseBillById } from "./purchaseThunk";

const initialState = {
  PurchaseInvoice: [],
  loading: false,
  error: null,
};

const purchaseSlice = createSlice({
  name: "purchaseBill",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchPurchaseBill.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPurchaseBill.fulfilled, (state, action) => {
        state.loading = false;
        state.PurchaseInvoice = action.payload || [];
      })
      .addCase(fetchPurchaseBill.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchPurchaseBillById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPurchaseBillById.fulfilled, (state, action) => {
        state.loading = false;
        state.PurchaseInvoice = action.payload || [];
      })
      .addCase(fetchPurchaseBillById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default purchaseSlice.reducer;
