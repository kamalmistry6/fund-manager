const express = require("express");
const router = express.Router();
const fundAllotController = require("../controllers/fundAllotController");

router.post("/", fundAllotController.allotFund);

module.exports = router;
