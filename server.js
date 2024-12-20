import express from "express";
import { ApolloServer } from "apollo-server-express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import { graphqlUploadExpress } from "graphql-upload-minimal";
import { typeDefs } from "./schema/index.js";
import { resolvers } from "./resolvers/index.js";
import { db } from "./db.js";
import { authMiddleware } from "./middleware/auth.js";

dotenv.config();

const PORT = process.env.PORT || 4000;

const app = express();

// CORS Configuration
app.use(
  cors({
    // origin: process.env.CLIENT_URL || "http://localhost:5173", // AWS Amplify
    // origin: "http://localhost:5173", // For local testing
    origin: process.env.CLIENT_URL, // AWS Amplify Endpoint
    credentials: true,
  })
);

app.use(cookieParser());
app.use(authMiddleware);

// File upload middleware - must be before Apollo Server middleware
app.use(graphqlUploadExpress());

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => ({
    req,
    res,
    db,
  }),
  cors: false, // Disable Apollo Server's CORS as we're handling it with Express
});

await server.start();

server.applyMiddleware({
  app,
  cors: false,
  path: "/graphql",
});

app.listen(PORT, "0.0.0.0", () =>
  console.log(`🚀 Server ready on port ${PORT}`)
);
