import { AUTH_CONFIG } from "../config/auth.js";

export const authResolvers = {
  Query: {
    tokenInfo: () => ({
      expiresIn: AUTH_CONFIG.TOKEN_EXPIRY_SECONDS,
      warningTime: AUTH_CONFIG.WARNING_TIME_SECONDS,
    }),
  },
};
