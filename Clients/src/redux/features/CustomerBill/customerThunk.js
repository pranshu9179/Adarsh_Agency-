import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../Config/axios";

const API_URL = "/customer/invoice";

export const fetchCustomerBill = createAsyncThunk(
  "/customerBill/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
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

// export const fetchPurchaseBillById = createAsyncThunk(
//   "/customerBill/fetchById",
//   async ({ id }, { rejectWithValue }) => {
//     try {
//       console.log("this is update purchase");

//       const res = await axiosInstance.get(
//         `${API_URL}/fetchPurchaseBillById/:${id}`
//       );
//       console.log("Response", res);

//       return res.data;
//     } catch (err) {
//       return rejectWithValue(
//         "error while fetching the Purchase bill data",
//         err
//       );
//     }
//   }
// );
