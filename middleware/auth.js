import jwt from "jsonwebtoken";
import { AUTH_CONFIG } from "../config/auth.js";
import { db } from "../db.js";

export const authMiddleware = async (req, res, next) => {
  try {
    // Check for token in cookies first, then authorization header
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]; // Extract token from Authorization header

    if (!token) {
      req.user = null;
      return next();
    }

    // Verify token
    const decoded = jwt.verify(token, AUTH_CONFIG.JWT_SECRET);

    // Get user from database
    const result = await db.query(
      "SELECT id, name, role, email FROM users WHERE id = $1",
      [decoded.id]
    );

    // Set user in request object
    req.user = result.rows[0];
  } catch (error) {
    console.error("Auth middleware error:", error);
    req.user = null;
  }
  next(); // Proceed to the next middleware or route handler
};
