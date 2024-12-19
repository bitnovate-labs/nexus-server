import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

export const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for cloud-hosted PostgreSQL
  },
});

// Test database connection
db.connect((err) => {
  if (err) {
    console.error("Database connection error:", err.stack);
  } else {
    console.log("Connected to database successfully");
  }
});

// -----------------------------------------------------------------
// export const db = new Pool({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASSWORD,
//   port: process.env.DB_PORT,
// });

// Test Supabase connection
// db.query("SELECT NOW()", (err, res) => {
//   if (err) {
//     console.error("Connection test failed:", err);
//   } else {
//     console.log("Connection successful:", res.rows[0]);
//   }
//   db.end();
// });
