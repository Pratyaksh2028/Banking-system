const { accounts } = require("../DB/bankDB");
const generateAccountNumber = require("../utils/generateAccountNumber");

const createAccount = (req, res) => {
    const existingAccount = accounts.find(acc => acc.userId === req.user.id);

    if (existingAccount) {
        return res.status(409).json({
            message: "User already has a bank account"
        });
    }

    const newAccount = {
        id: accounts.length + 1,
        userId: req.user.id,
        accountNumber: generateAccountNumber(accounts.length + 1),
        balance: 0,
        status: "active"
    };

    accounts.push(newAccount);

    res.status(201).json({
        message: "Bank account created successfully",
        data: newAccount
    });
};

const getMyAccount = (req, res) => {
    const account = accounts.find(acc => acc.userId === req.user.id);

    if (!account) {
        return res.status(404).json({
            message: "Account not found"
        });
    }

    res.status(200).json({
        message: "Account fetched successfully",
        data: account
    });
};

const getBalance = (req, res) => {
    const account = accounts.find(acc => acc.userId === req.user.id);

    if (!account) {
        return res.status(404).json({
            message: "Account not found"
        });
    }

    res.status(200).json({
        accountNumber: account.accountNumber,
        balance: account.balance,
        status: account.status
    });
};

module.exports = {
    createAccount,
    getMyAccount,
    getBalance
};