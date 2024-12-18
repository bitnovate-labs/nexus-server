import jwt from "jsonwebtoken";
import { AUTH_CONFIG } from "../config/auth.js";

export const authMiddleware = (req, res, next) => {
  try {
    // Check for token in cookies first, then authorization header
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]; // Extract token from Authorization header

    if (token) {
      try {
        // Verify token
        const decoded = jwt.verify(token, AUTH_CONFIG.JWT_SECRET);
        if (decoded) {
          // Add full user object to request
          req.user = decoded;
        }
      } catch (error) {
        console.error("Token verification error:", error);
      }
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
  }
  next(); // Proceed to the next middleware or route handler
};
