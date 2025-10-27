// src/redux/company/companyThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../Config/axios";

const API_URL = "/api/company"; // adjust path as per your backend route

// Utility to get error messages
const getErrorMessage = (error) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.error || error.message;
  }
  return error.message;
};

// Get all companies
export const fetchCompanies = createAsyncThunk(
  "company/fetchCompanies",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(API_URL);
      return res.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Get company by ID
export const fetchCompanyById = createAsyncThunk(
  "company/fetchCompanyById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/${id}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Create new company
export const createCompany = createAsyncThunk(
  "company/createCompany",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(API_URL, data);
      return res.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Update company by ID
export const updateCompany = createAsyncThunk(
  "company/updateCompany",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${API_URL}/${id}`, data);
      return res.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Delete company by ID
export const deleteCompany = createAsyncThunk(
  "company/deleteCompany",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      return { id };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);
