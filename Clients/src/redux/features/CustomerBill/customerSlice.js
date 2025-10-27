import { createSlice } from "@reduxjs/toolkit";

import { fetchCustomerBill } from "./customerThunk";

const initialState = {
  CustomerInvoice: [],
  loading: false,
  error: null,
};

const customerSlice = createSlice({
  name: "customerBill",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomerBill.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCustomerBill.fulfilled, (state, action) => {
        state.loading = false;
        state.CustomerInvoice = action.payload || [];
      })
      .addCase(fetchCustomerBill.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default customerSlice.reducer;
