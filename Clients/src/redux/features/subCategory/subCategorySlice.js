// src/redux/subCategory/subCategorySlice.js
import { createSlice } from "@reduxjs/toolkit";
import {
  fetchSubCategories,
  fetchSubCategoryById,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
} from "./subCategoryThunks";

const initialState = {
  subCategories: [],
  subCategory: null,
  loading: false,
  error: null,
};

const subCategorySlice = createSlice({
  name: "subCategory",
  initialState,
  reducers: {
    clearSubCategory(state) {
      state.subCategory = null;
    },
    clearSubCategoryError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔹 Fetch all
      .addCase(fetchSubCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.subCategories = action.payload;
      })
      .addCase(fetchSubCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch subcategories";
      })

      // 🔹 Fetch by ID
      .addCase(fetchSubCategoryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubCategoryById.fulfilled, (state, action) => {
        state.loading = false;
        state.subCategory = action.payload;
      })
      .addCase(fetchSubCategoryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch subcategory";
      })

      // 🔹 Create
      .addCase(createSubCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSubCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.subCategories.push(action.payload);
      })
      .addCase(createSubCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create subcategory";
      })

      // 🔹 Update
      .addCase(updateSubCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSubCategory.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.subCategories.findIndex(
          (item) => item._id === action.payload._id
        );
        if (index !== -1) {
          state.subCategories[index] = action.payload;
        }
      })
      .addCase(updateSubCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update subcategory";
      })

      // 🔹 Delete
      .addCase(deleteSubCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSubCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.subCategories = state.subCategories.filter(
          (item) => item._id !== action.payload.id
        );
      })
      .addCase(deleteSubCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete subcategory";
      });
  },
});

export const { clearSubCategory, clearSubCategoryError } =
  subCategorySlice.actions;
export default subCategorySlice.reducer;
