const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

dotenv.config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test connection at startup
(async () => {
  try {
    const connection = await db.getConnection();
    console.log("✅ Database pool initialized successfully");
    connection.release();
  } catch (error) {
    console.error("❌ Error initializing database pool:", error.message);
  }
})();

module.exports = db;
