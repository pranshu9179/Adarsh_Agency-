const SalesManModel = require("../Models/SalesManModel");
const jwt = require("jsonwebtoken");

const protectedRoutes = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    console.log(req);

    console.log(token, "jhgfhg");

    if (!token) {
      return res
        .status(401)
        .json({ status: false, message: "invalid token id" });
    }

    const decoded = jwt.verify(token, process.env.JWT);

    const user = await SalesManModel.findById(decoded.id).select("-password");
    if (!user) {
      return res
        .status(401)
        .json({ status: false, message: "Token is not valid" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error.message);
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = protectedRoutes;
