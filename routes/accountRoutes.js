const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");

const {
    createAccount,
    getMyAccount,
    getBalance
} = require("../controllers/accountController");

router.post("/create", authMiddleware, createAccount);
router.get("/my-account", authMiddleware, getMyAccount);
router.get("/balance", authMiddleware, getBalance);

module.exports = router;