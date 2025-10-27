// src/redux/salesman/salesmanSlice.js
import { createSlice } from "@reduxjs/toolkit";
import {
  createSalesman,
  fetchSalesmen,
  fetchSalesmanById,
  updateSalesman,
  deleteSalesman,
} from "./salesManThunks";

const initialState = {
  salesmen: [],
  salesman: null,
  loading: false,
  error: null,
};

const salesmanSlice = createSlice({
  name: "salesman",
  initialState,
  reducers: {
    clearSalesman(state) {
      state.salesman = null;
    },
    clearSalesmanError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 📥 Fetch all
      .addCase(fetchSalesmen.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSalesmen.fulfilled, (state, action) => {
        state.loading = false;
        state.salesmen = action.payload;
      })
      .addCase(fetchSalesmen.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 📥 Fetch one
      .addCase(fetchSalesmanById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSalesmanById.fulfilled, (state, action) => {
        state.loading = false;
        state.salesman = action.payload;
      })
      .addCase(fetchSalesmanById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ➕ Create
      .addCase(createSalesman.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSalesman.fulfilled, (state, action) => {
        state.loading = false;
        state.salesmen.push(action.payload);
      })
      .addCase(createSalesman.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✏️ Update
      .addCase(updateSalesman.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSalesman.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.salesmen.findIndex(
          (s) => s._id === action.payload._id
        );
        if (index !== -1) {
          state.salesmen[index] = action.payload;
        }
      })
      .addCase(updateSalesman.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ❌ Delete
      .addCase(deleteSalesman.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSalesman.fulfilled, (state, action) => {
        state.loading = false;
        state.salesmen = state.salesmen.filter((s) => s._id !== action.payload);
      })
      .addCase(deleteSalesman.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSalesman, clearSalesmanError } = salesmanSlice.actions;
export default salesmanSlice.reducer;
