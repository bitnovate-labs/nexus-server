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

const PORT = process.env.PORT || 4000;

dotenv.config();

const app = express();

// const corsOptions = {
//   origin: "http://nexus-client-app.s3-website-ap-southeast-1.amazonaws.com",
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   allowedHeaders: ["Content-Type", "Authorization"],
//   credentials: true, // Set to true if you need to handle cookies or authentication
// };

// CORS Configuration
app.use(
  cors({
    origin: "http://localhost:5173", // Vite dev server
    // origin: process.env.CLIENT_URL,
    // corsOptions,
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

app.listen({ port: PORT }, "0.0.0.0", () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);
