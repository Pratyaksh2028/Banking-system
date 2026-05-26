const { users, accounts, transactions } = require("../DB/bankDB");

const getAllUsers = (req, res) => {
    const safeUsers = users.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    }));

    res.status(200).json({
        message: "All users fetched successfully",
        data: safeUsers
    });
};

const getAllAccounts = (req, res) => {
    res.status(200).json({
        message: "All accounts fetched successfully",
        data: accounts
    });
};

const getAllTransactions = (req, res) => {
    res.status(200).json({
        message: "All transactions fetched successfully",
        data: transactions
    });
};

const freezeAccount = (req, res) => {
    const accountId = parseInt(req.params.id);
    const account = accounts.find(acc => acc.id === accountId);

    if (!account) {
        return res.status(404).json({ message: "Account not found" });
    }

    account.status = "frozen";

    res.status(200).json({
        message: "Account frozen successfully",
        data: account
    });
};

const unfreezeAccount = (req, res) => {
    const accountId = parseInt(req.params.id);
    const account = accounts.find(acc => acc.id === accountId);

    if (!account) {
        return res.status(404).json({ message: "Account not found" });
    }

    account.status = "active";

    res.status(200).json({
        message: "Account unfrozen successfully",
        data: account
    });
};

module.exports = {
    getAllUsers,
    getAllAccounts,
    getAllTransactions,
    freezeAccount,
    unfreezeAccount
};