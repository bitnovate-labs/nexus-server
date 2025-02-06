import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { AUTH_CONFIG } from "../config/auth.js";

export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      role: user.role,
      username: user.username,
    },
    AUTH_CONFIG.JWT_SECRET,
    {
      expiresIn: AUTH_CONFIG.TOKEN_EXPIRY,
      algorithm: "HS256",
    }
  );
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, AUTH_CONFIG.JWT_SECRET);
  } catch (error) {
    console.error("Token verification error:", error);
    return null;
  }
};

export const hashPassword = async (password) => {
  return bcrypt.hash(password, 10);
};

export const comparePasswords = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};
