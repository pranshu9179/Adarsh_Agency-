require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

// ---------Routes----------
const protectedRoutes = require("./middleware/auth.middleware");
const CompanyRoute = require("./Routes/CompanyRoute");
const CategoryRoute = require("./Routes/CategoryRoute");
const SubCategoryRoute = require("./Routes/SubCategoryRoute");
const ProductRoute = require("./Routes/ProductRoute");
const SalesManRoute = require("./Routes/SalesManRoute");
const BillingRoute = require("./Routes/ProductBillingRoute");
const VendorRoute = require("./Routes/VendorRoute");
const PurchaseRoute = require("./Routes/PurchaseRoute");
const customerRoutes = require("./Routes/CustomerRoute");
const auth = require("./Routes/auth.controller");
const CheckAuth = require("./Routes/CheckAuth");
const fetchShopName = require("./Routes/getShopName");
const addProductData = require("./Routes/addSalesmanProductData");
const Logout = require("./Routes/logoutSalesman.js");
const customerBillInvoice = require("./Controller/CustomerBillCTRL.js");

//  Morgan middleware (logs all requests in 'dev' format)
app.use(morgan("dev"));

app.use(
  cors({
    origin: [
      process.env.CORS_ORIGIN,
      process.env.CORS_ORIGIN_2,
      process.env.CORS_LOCAL,
      process.env.CORS_LOCAL_2,
    ],
    credentials: true,
  })
);

app.options("*", cors());

// Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
//  MongoDB Connection
mongoose
  .connect(process.env.dbUrl)
  .then(() => console.log(" DB connected"))
  .catch((err) => console.error(" DB Connection Error:", err));

//  Static Files

app.use("/public", express.static(path.join(__dirname, "public")));

//  Routes
app.use("/api/vendor/ledger", require("./Routes/ledger.routes"));
app.use("/api/ledger", require("./Routes/CustomerledgerRoute"));
app.use("/api/invoices", require("./Routes/customerBillroute"));
app.use("/api/company", CompanyRoute);
app.use("/api/category", CategoryRoute);
app.use("/api/customer", customerRoutes);
app.use("/api/product", ProductRoute);
app.use("/api/Subcategory", SubCategoryRoute);
app.use("/api/salesman", SalesManRoute);
app.use("/api/pro-billing", BillingRoute);

app.use("/api/vendor", VendorRoute);
app.use("/api/purchase", PurchaseRoute);
app.use("/api/login", auth);
app.use("/api/checksalesman", CheckAuth);
app.use("/api/fetchshopname", fetchShopName);
app.use("/api/addsalesmanproductdata", addProductData);
app.use("/api/logout", Logout);

//  404 Not Found Handler
app.use((req, res, next) => {
  const error = new Error(" Resource not found");
  error.status = 404;
  next(error);
});

//  Global Error Handler
app.use((err, req, res, next) => {
  console.error(" Error:", err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

//  Server Listen
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(` Server running on port ${port}`);
});
