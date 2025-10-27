import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../Config/axios";

const API_URL = "/purchase";

export const fetchPurchaseBill = createAsyncThunk(
  "/purchaseBill/fetchAll",
  async (_, { rejectWithValue }) => {
    console.log("poiuytrewq");

    try {
      console.log("dfghjk");

      const res = await axiosInstance.get(API_URL);
      console.log("Response", res);

      return res.data;
    } catch (err) {
      return rejectWithValue(
        "error while fetching the Purchase bill data",
        err
      );
    }
  }
);

export const fetchPurchaseBillById = createAsyncThunk(
  "/purchaseBill/fetchById",
  async ({ id }, { rejectWithValue }) => {
    try {
      console.log("this is update purchase");

      const res = await axiosInstance.get(
        `${API_URL}/fetchPurchaseBillById/:${id}`
      );
      console.log("Response", res);

      return res.data;
    } catch (err) {
      return rejectWithValue(
        "error while fetching the Purchase bill data",
        err
      );
    }
  }
);
