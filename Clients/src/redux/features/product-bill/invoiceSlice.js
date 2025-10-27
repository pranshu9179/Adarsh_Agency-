import { createSlice } from "@reduxjs/toolkit";
import {
  createInvoice,
  fetchInvoices,
  fetchInvoiceById,
  deleteInvoice,
  fetchInvoicesByCustomer,
  fetchBalanceByCustomer,
  fetchInvoicesBySalesman,
  fetchInvoicesByBeat, // ✅ sb branch wala
} from "./invoiceThunks";

const initialState = {
  invoices: [],
  areaWise: [], // ✅ sb branch ka areaWise
  currentInvoice: null,
  invoicesByCustomer: [],
  invoicesBySalesman: [],
  balanceByCustomer: 0,
  loading: false,
  error: null,
};

const invoiceSlice = createSlice({
  name: "invoice",
  initialState,
  reducers: {
    clearInvoice(state) {
      state.currentInvoice = null;
    },
    clearInvoiceError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // ✅ sb branch ➡️ Beat invoices
      .addCase(fetchInvoicesByBeat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoicesByBeat.fulfilled, (state, action) => {
        state.loading = false;
        state.areaWise = action.payload || [];
      })
      .addCase(fetchInvoicesByBeat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || action.error.message;
      })

      // ✅ Invoices by Salesman
      .addCase(fetchInvoicesBySalesman.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoicesBySalesman.fulfilled, (state, action) => {
        state.loading = false;
        state.invoicesBySalesman = action.payload;
      })
      .addCase(fetchInvoicesBySalesman.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ Invoices by Customer
      .addCase(fetchInvoicesByCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoicesByCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.invoicesByCustomer = action.payload;
      })
      .addCase(fetchInvoicesByCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ Balance by Customer
      .addCase(fetchBalanceByCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBalanceByCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.balanceByCustomer = action.payload.balance;
      })
      .addCase(fetchBalanceByCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ➕ Create Invoice
      .addCase(createInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices.unshift(action.payload);
      })
      .addCase(createInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 📥 Fetch All Invoices
      .addCase(fetchInvoices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices = action.payload;
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 📄 Fetch Single Invoice
      .addCase(fetchInvoiceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoiceById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentInvoice = action.payload;
      })
      .addCase(fetchInvoiceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🗑️ Delete Invoice
      .addCase(deleteInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices = state.invoices.filter(
          (inv) => inv._id !== action.payload
        );
      })
      .addCase(deleteInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearInvoice, clearInvoiceError } = invoiceSlice.actions;
export default invoiceSlice.reducer;
