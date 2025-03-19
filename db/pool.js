require("dotenv").config();
const { Pool } = require("pg");

console.log("🔗 Connecting to database:", process.env.DATABASE_URL); // ✅ Log the URL

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for Render
  },
});

module.exports = pool;
