// src/redux/company/companySlice.js
import { createSlice } from "@reduxjs/toolkit";
import {
  fetchCompanies,
  fetchCompanyById,
  createCompany,
  updateCompany,
  deleteCompany,
} from "./companyThunks";

const initialState = {
  companies: [],
  company: null,
  loading: false,
  error: null,
};

const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    clearCompany(state) {
      state.company = null;
    },
    clearCompanyError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔹 Fetch All
      .addCase(fetchCompanies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.loading = false;
        state.companies = action.payload;
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch companies";
      })

      // 🔹 Fetch One
      .addCase(fetchCompanyById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanyById.fulfilled, (state, action) => {
        state.loading = false;
        state.company = action.payload;
      })
      .addCase(fetchCompanyById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch company";
      })

      // 🔹 Create
      .addCase(createCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.companies.push(action.payload);
      })
      .addCase(createCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create company";
      })

      // 🔹 Update
      .addCase(updateCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCompany.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.companies.findIndex(
          (c) => c._id === action.payload._id
        );
        if (index !== -1) {
          state.companies[index] = action.payload;
        }
      })
      .addCase(updateCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update company";
      })

      // 🔹 Delete
      .addCase(deleteCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.companies = state.companies.filter(
          (c) => c._id !== action.payload.id
        );
      })
      .addCase(deleteCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete company";
      });
  },
});

export const { clearCompany, clearCompanyError } = companySlice.actions;
export default companySlice.reducer;
