const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const {
    getAllUsers,
    getAllAccounts,
    getAllTransactions,
    freezeAccount,
    unfreezeAccount
} = require("../controllers/adminController");

router.use(authMiddleware);
router.use(roleMiddleware("admin"));

router.get("/users", getAllUsers);
router.get("/accounts", getAllAccounts);
router.get("/transactions", getAllTransactions);
router.patch("/accounts/:id/freeze", freezeAccount);
router.patch("/accounts/:id/unfreeze", unfreezeAccount);

module.exports = router;