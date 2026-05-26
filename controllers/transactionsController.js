const { accounts, transactions } = require("../DB/bankDB");

const depositMoney = (req, res) => {
    const account = accounts.find(acc => acc.userId === req.user.id);

    if (!account) {
        return res.status(404).json({ message: "Account not found" });
    }

    if (account.status !== "active") {
        return res.status(403).json({ message: "Account is not active" });
    }

    account.balance += req.body.amount;

    const transaction = {
        id: transactions.length + 1,
        accountId: account.id,
        type: "deposit",
        amount: req.body.amount,
        description: "Money deposited",
        createdAt: new Date().toISOString()
    };

    transactions.push(transaction);

    res.status(200).json({
        message: "Deposit successful",
        balance: account.balance,
        transaction
    });
};

const withdrawMoney = (req, res) => {
    const account = accounts.find(acc => acc.userId === req.user.id);

    if (!account) {
        return res.status(404).json({ message: "Account not found" });
    }

    if (account.status !== "active") {
        return res.status(403).json({ message: "Account is not active" });
    }

    if (account.balance < req.body.amount) {
        return res.status(400).json({ message: "Insufficient balance" });
    }

    account.balance -= req.body.amount;

    const transaction = {
        id: transactions.length + 1,
        accountId: account.id,
        type: "withdraw",
        amount: req.body.amount,
        description: "Money withdrawn",
        createdAt: new Date().toISOString()
    };

    transactions.push(transaction);

    res.status(200).json({
        message: "Withdrawal successful",
        balance: account.balance,
        transaction
    });
};

const transferMoney = (req, res) => {
    const { receiverAccountNumber, amount } = req.body;

    const senderAccount = accounts.find(acc => acc.userId === req.user.id);
    const receiverAccount = accounts.find(acc => acc.accountNumber === receiverAccountNumber);

    if (!senderAccount) {
        return res.status(404).json({ message: "Sender account not found" });
    }

    if (!receiverAccount) {
        return res.status(404).json({ message: "Receiver account not found" });
    }

    if (senderAccount.accountNumber === receiverAccount.accountNumber) {
        return res.status(400).json({ message: "Cannot transfer to same account" });
    }

    if (senderAccount.status !== "active" || receiverAccount.status !== "active") {
        return res.status(403).json({ message: "One of the accounts is frozen" });
    }

    if (senderAccount.balance < amount) {
        return res.status(400).json({ message: "Insufficient balance" });
    }

    senderAccount.balance -= amount;
    receiverAccount.balance += amount;

    const debitTransaction = {
        id: transactions.length + 1,
        accountId: senderAccount.id,
        type: "transfer_debit",
        amount,
        description: `Transfer to ${receiverAccount.accountNumber}`,
        createdAt: new Date().toISOString()
    };

    transactions.push(debitTransaction);

    const creditTransaction = {
        id: transactions.length + 1,
        accountId: receiverAccount.id,
        type: "transfer_credit",
        amount,
        description: `Transfer from ${senderAccount.accountNumber}`,
        createdAt: new Date().toISOString()
    };

    transactions.push(creditTransaction);

    res.status(200).json({
        message: "Transfer successful",
        balance: senderAccount.balance,
        transaction: debitTransaction
    });
};

const getTransactionHistory = (req, res) => {
    const account = accounts.find(acc => acc.userId === req.user.id);

    if (!account) {
        return res.status(404).json({ message: "Account not found" });
    }

    const history = transactions.filter(t => t.accountId === account.id);

    res.status(200).json({
        message: "Transaction history fetched successfully",
        data: history
    });
};

module.exports = {
    depositMoney,
    withdrawMoney,
    transferMoney,
    getTransactionHistory
};