const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token found" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    console.log("Decoded token: ", decoded); // <-- check this

    req.user = decoded;
    next();
  });
};

exports.verifyAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ error: "Only admin can perform this action" });
  }
  next();
};
