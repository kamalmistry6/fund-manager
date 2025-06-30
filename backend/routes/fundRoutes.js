const express = require("express");
const router = express.Router();
const fundController = require("../controllers/fundController");

router.get("/", fundController.getFunds);
router.post("/", fundController.addFund);
router.delete("/:id", fundController.deleteFund);
router.get("/download-excel", fundController.downloadFundsExcel);

module.exports = router;
