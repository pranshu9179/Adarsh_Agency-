const express = require("express");
const Customer = require("../Models/CustomerModel");

const routes = express.Router();

routes.get("/", async (req, res) => {
  try {
    let { location } = req.query;
    console.log(location, "location from query (raw)");

    if (!location) {
      return res.status(400).json({ error: "Location is required" });
    }

    // Replace '+' with space and trim extra spaces
    location = location.replace(/\+/g, " ").trim();

    // Optional: remove all spaces if you want "CHHOLA" instead of "CHH OLA"
    // location = location.replace(/\s+/g, "");

    console.log(location, "normalized location");

    const customers = await Customer.find({ area: location });
    console.log(customers);

    res.status(200).json(customers);
  } catch (err) {
    console.error("Error fetching customers:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


module.exports = routes;
