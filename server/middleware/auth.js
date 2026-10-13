import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

export const authentication = async (req, res, next) => {
  try {
    // 👈 Get the token from the "Authorization" header
    const authHeader = req.headers.authorization;
    
    // The header format is usually: "Bearer YOUR_JWT_TOKEN"
    // This splits the string and extracts just the token part
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ success: false, msg: "Unauthorized - No Token Provided" });
    }

    // Verify token validity
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    return res
      .status(401)
      .json({ success: false, msg: "Unauthorized - Invalid Token" });
  }
};
