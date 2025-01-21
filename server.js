import express from "express";
import { ApolloServer } from "apollo-server-express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { graphqlUploadExpress } from "graphql-upload-minimal";
// Graphql schema and resolvers
import { typeDefs } from "./schema/index.js";
import { resolvers } from "./resolvers/index.js";
// Postgres database connection
import { db } from "./db.js";
import { authMiddleware } from "./middleware/auth.js";

dotenv.config();

const PORT = process.env.PORT || 4000;

const app = express();

// CORS Configuration (uncomment for Local Testing)
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(cookieParser());
app.use(authMiddleware);

// Serve uploaded files
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// File upload middleware - must be before Apollo Server middleware
app.use(
  graphqlUploadExpress({
    maxFileSize: 5 * 1024 * 1024, // 5MB
    maxFiles: 10,
  })
);

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
