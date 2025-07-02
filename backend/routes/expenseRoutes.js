const express = require("express");
const router = express.Router();
const expenseController = require("../controllers/expenseController");
const upload = require("../middlewares/multer");

router.post("/", upload.single("bill_photo"), expenseController.addExpense);
router.get("/", expenseController.getExpenses);
router.delete("/:id", expenseController.deleteExpense);

module.exports = router;
