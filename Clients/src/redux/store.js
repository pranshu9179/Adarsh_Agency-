import { configureStore } from "@reduxjs/toolkit";

import productReducer from "./features/product/productSlice";
import companyReducer from "./features/company/companySlice";
import salesmanReducer from "./features/salesMan/salesManSlice";
import customerReducer from "./features/customer/customerSlice";
import categoryReducer from "./features/Category/categorySlice";

import vendorReducer from "./features/vendor/vendorSlice";
import purchaseReducer from "./features/purchase/purchaseSlice";
import invoiceReducer from "./features/product-bill/invoiceSlice";
import subCategoryReducer from "./features/subCategory/subCategorySlice";
import ledgerReducer from "./features/ledger/ledgerSlice";

import purchaseBillReducer from "./features/PurchaseBill/purchaseSlice";

import customerBillReducer from "./features/CustomerBill/customerSlice";

export const store = configureStore({
  reducer: {
    ledger: ledgerReducer,
    company: companyReducer,
    product: productReducer,
    customer: customerReducer,
    category: categoryReducer,
    salesman: salesmanReducer,
    invoice: invoiceReducer,
    vendor: vendorReducer,
    purchase: purchaseReducer,
    subCategory: subCategoryReducer,
    purchaseBillInvoice: purchaseBillReducer,
    customerBillInvoice: customerBillReducer,
  },
});
