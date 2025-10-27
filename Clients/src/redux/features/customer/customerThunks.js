// src/redux/customer/customerThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../Config/axios";

const API_URL = "/customer";

// Utility to extract error message
const getErrorMessage = (error) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.error || error.message;
  }
  return error.message;
};

// Fetch all customers
export const fetchCustomers = createAsyncThunk(
  "customer/fetchCustomers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Fetch a customer by ID
export const fetchCustomerById = createAsyncThunk(
  "customer/fetchCustomerById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Create a new customer
export const createCustomer = createAsyncThunk(
  "customer/createCustomer",
  async (customerData, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, customerData);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Update a customer
export const updateCustomer = createAsyncThunk(
  "customer/updateCustomer",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

//update customer advance
export const updateCustomerAdvanced = createAsyncThunk(
  "customer/updateCustomerAdvanced",
  async ({ customerAdvanceId, pending }, { rejectWithValue }) => {
    console.log(customerAdvanceId);
    console.log(pending);

    try {
      const response = await axios.put(
        `${API_URL}/advanced/${customerAdvanceId}`,
        { pending }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// update customer balanced

export const updateCustomerBalanced = createAsyncThunk(
  "customer/updateCustomerBalanced",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/balance/${id}`, { data });
      return response.data; // ✅ return full backend JSON
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Delete a customer
export const deleteCustomer = createAsyncThunk(
  "customer/deleteCustomer",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      return { id };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);
// get all beats a customer

// ✅ Thunk to fetch all areas
export const getAllBeats = createAsyncThunk(
  "areas/getAllBeats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/salesman/beats"); // <-- yaha tera route hai
      return response.data.beats;
    } catch (err) {
      return rejectWithValue(err.response.data || err.message);
    }
  }
);
