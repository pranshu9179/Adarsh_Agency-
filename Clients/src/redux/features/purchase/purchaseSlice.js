// src/redux/purchase/purchaseSlice.js
import { createSlice } from "@reduxjs/toolkit";
import {
  createPurchase,
  fetchPurchases,
  fetchPurchaseById,
  updatePurchase,
  deletePurchase,
  fetchNextEntryNumber,
  getBalance,
} from "./purchaseThunks";

const initialState = {
  list: [],
  current: null,
  balance: null,
  nextEntryNumber: null,
  loading: false,
  error: null,
};

const purchaseSlice = createSlice({
  name: "purchase",
  initialState,
  reducers: {
    clearPurchase(state) {
      state.current = null;
    },
    clearPurchaseError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ➕ Create
      .addCase(createPurchase.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPurchase.fulfilled, (state, action) => {
        state.loading = false;
        state.list.unshift(action.payload);
      })
      .addCase(createPurchase.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 📋 Fetch all
      .addCase(fetchPurchases.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPurchases.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchPurchases.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🆔 Fetch one
      .addCase(fetchPurchaseById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPurchaseById.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(fetchPurchaseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔧 Update
      .addCase(updatePurchase.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePurchase.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.list.findIndex((p) => p._id === action.payload._id);
        if (idx !== -1) state.list[idx] = action.payload;
      })
      .addCase(updatePurchase.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🗑️ Delete
      .addCase(deletePurchase.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePurchase.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter((p) => p._id !== action.payload);
      })
      .addCase(deletePurchase.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔢 Fetch next entry #
      .addCase(fetchNextEntryNumber.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNextEntryNumber.fulfilled, (state, action) => {
        state.loading = false;
        state.nextEntryNumber = action.payload;
      })
      .addCase(fetchNextEntryNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // 🔢 Fetch balance #
      .addCase(getBalance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBalance.fulfilled, (state, action) => {
        state.loading = false;
        state.balance = action.payload;
      })
      .addCase(getBalance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearPurchase, clearPurchaseError } = purchaseSlice.actions;
export default purchaseSlice.reducer;
