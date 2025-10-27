const express = require("express");
const protectedRoutes = require("../middleware/auth.middleware");
const jwt = require("jsonwebtoken")

const router = express.Router();

router.get("/", protectedRoutes, (req, res) => {
  res.json({ status: true, user: req.user });
});

// router.post("/", (req, res) => {
//   console.log(req,"this is req");
//   console.log(res,"this is res");

//   const token = req?.cookies?.token;

//   console.log(req?.cookies?.token,"this is token.cookies");
  
//   console.log(token,"this is token");
  

//   if (!token) {
//     return res.json({ status: false, message: "No token found" });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT);
//     return res.json({ status: true, user: decoded });
//   } catch (err) {
//     return res.json({ status: false, message: "Invalid token" });
//   }
// });

module.exports = router;
