// src/redux/customer/customerSlice.js
import { createSlice } from "@reduxjs/toolkit";
import {
  fetchCustomers,
  fetchCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getAllBeats,
  updateCustomerBalanced,
  updateCustomerAdvanced,
} from "./customerThunks";

const initialState = {
  customers: [],
  customer: null,
  beats: [],
  loading: false,
  error: null,
};

const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    clearCustomer(state) {
      state.customer = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔹 FETCH ALL CUSTOMERS
      .addCase(getAllBeats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllBeats.fulfilled, (state, action) => {
        state.loading = false;
        state.beats = action.payload;
      })
      .addCase(getAllBeats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch customers";
      })
      // 🔹 FETCH ALL CUSTOMERS
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch customers";
      })

      // 🔹 FETCH CUSTOMER BY ID
      .addCase(fetchCustomerById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomerById.fulfilled, (state, action) => {
        state.loading = false;
        state.customer = action.payload;
      })
      .addCase(fetchCustomerById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch customer";
      })

      // 🔹 CREATE CUSTOMER
      .addCase(createCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.customers.push(action.payload);
      })
      .addCase(createCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create customer";
      })

      // 🔹 UPDATE CUSTOMER
      .addCase(updateCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.customers.findIndex(
          (c) => c._id === action.payload._id
        );
        if (index !== -1) {
          state.customers[index] = action.payload;
        }
      })
      .addCase(updateCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update customer";
      })

      //UPDATE CUSTOMER BALANCED
      .addCase(updateCustomerBalanced.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCustomerBalanced.fulfilled, (state) => {
        state.loading = false;
        // state.error = null;
      })
      .addCase(updateCustomerBalanced.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update customer";
      })
      //add advanced
      .addCase(updateCustomerAdvanced.fulfilled, (state) => {
        state.loading = false;
      })
      // 🔹 DELETE CUSTOMER
      .addCase(deleteCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = state.customers.filter(
          (c) => c._id !== action.payload.id
        );
      })
      .addCase(deleteCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete customer";
      });
  },
});

export const { clearCustomer, clearError } = customerSlice.actions;
export default customerSlice.reducer;
