import dotenv from "dotenv";

dotenv.config();

export const AUTH_CONFIG = {
  JWT_SECRET: process.env.JWT_SECRET,
  //   TOKEN_EXPIRY: "24h", // Token lifetime
  TOKEN_EXPIRY: "15m", // TEST
  //   TOKEN_EXPIRY_SECONDS: 24 * 60 * 60, // 24 hours in seconds
  TOKEN_EXPIRY_SECONDS: 15 * 60, // TEST
  WARNING_TIME_SECONDS: 5 * 60, // 5 minutes warning before expiry
};

// TOKEN_EXPIRY - LOGS OUT immediately (when set duration is met)
// TOKEN_EXPIRE_SECONDS -
// WARNING_TIME_SECONDS - how long the Session Expiry alert will display BEFORE it LOGOUT
