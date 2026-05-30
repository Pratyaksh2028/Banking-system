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

console.log("authMiddleware:", typeof authMiddleware);
console.log("validateAmount:", typeof validateAmount);
console.log("validateTransfer:", typeof validateTransfer);
console.log("depositMoney:", typeof depositMoney);
console.log("withdrawMoney:", typeof withdrawMoney);
console.log("transferMoney:", typeof transferMoney);
console.log("getTransactionHistory:", typeof getTransactionHistory);

router.post("/deposit", authMiddleware, validateAmount, depositMoney);
router.post("/withdraw", authMiddleware, validateAmount, withdrawMoney);
router.post("/transfer", authMiddleware, validateTransfer, transferMoney);
router.get("/history", authMiddleware, getTransactionHistory);

module.exports = router;