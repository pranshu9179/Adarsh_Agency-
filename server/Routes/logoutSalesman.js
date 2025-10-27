const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  try {
    console.log("this is calll");

    // Clear the cookie
    res.clearCookie("token", {
      httpOnly: true, // match the same options you used while setting it
      secure: false,
      sameSite: "strict",
    });

    return res.json({ success: true, message: "Cookie cleared successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ success: false, message: "Logout failed" });
  }
});

module.exports = router;
