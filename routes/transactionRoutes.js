const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");

const {
    validateAmount,
    validateTransfer
} = require("../middlewares/validationMiddleware");

const {
    depositMoney,
    withdrawMoney,
    transferMoney,
    getTransactionHistory
} = require("../controllers/transactionsController");

router.post("/deposit", authMiddleware, validateAmount, depositMoney);
router.post("/withdraw", authMiddleware, validateAmount, withdrawMoney);
router.post("/transfer", authMiddleware, validateTransfer, transferMoney);
router.get("/history", authMiddleware, getTransactionHistory);

module.exports = router;