const express = require("express");
const router = express.Router();
const userExpensesController = require("../controllers/userExpensesController");

router.post("/", userExpensesController.addUserExpense);
router.get("/:userId", userExpensesController.getUserExpensesByUser);
router.get("/total-amount/:userId", userExpensesController.getTotalAmount);

module.exports = router;
