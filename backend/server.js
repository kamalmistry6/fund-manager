const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

const fundRoutes = require("./routes/fundRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const statsRoutes = require("./routes/statsRoute");
const userExpenses = require("./routes/userExpensesRoutes");
const fundAllotRoutes = require("./routes/fundAllotRoutes");
const authRoutes = require("./routes/authRoutes");

dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/funds", fundRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/user-expenses", userExpenses);
app.use("/api/allot", fundAllotRoutes);
app.use("/api/auth", authRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Health check ping route — ADD THIS HERE
app.get("/ping", (req, res) => {
  res.status(200).send("pong");
});

// Server start
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
