const db = require("../config/db");

const depositMoney = (req, res) => {
    const amount = Number(req.body.amount);

    db.query(
        "SELECT * FROM accounts WHERE user_id = ?",
        [req.user.id],
        (err, accounts) => {
            if (err)
                return res.status(500).json({ error: err.message });

            if (accounts.length === 0)
                return res.status(404).json({ message: "Account not found" });

            const account = accounts[0];

            if (account.status !== "active")
                return res.status(403).json({ message: "Account is not active" });

            const newBalance = Number(account.balance) + amount;

            db.query(
                "UPDATE accounts SET balance = ? WHERE id = ?",
                [newBalance, account.id],
                (err) => {
                    if (err)
                        return res.status(500).json({ error: err.message });

                    db.query(
                        "INSERT INTO transactions (account_id, type, amount, description) VALUES (?, ?, ?, ?)",
                        [account.id, "deposit", amount, "Money deposited"],
                        (err, result) => {
                            if (err)
                                return res.status(500).json({ error: err.message });

                            res.status(200).json({
                                message: "Deposit successful",
                                balance: newBalance,
                                transactionId: result.insertId
                            });
                        }
                    );
                }
            );
        }
    );
};

const withdrawMoney = (req, res) => {
    const amount = Number(req.body.amount);

    db.query(
        "SELECT * FROM accounts WHERE user_id = ?",
        [req.user.id],
        (err, accounts) => {
            if (err)
                return res.status(500).json({ error: err.message });

            if (accounts.length === 0)
                return res.status(404).json({ message: "Account not found" });

            const account = accounts[0];

            if (account.status !== "active")
                return res.status(403).json({ message: "Account is not active" });

            if (Number(account.balance) < amount)
                return res.status(400).json({ message: "Insufficient balance" });

            const newBalance = Number(account.balance) - amount;

            db.query(
                "UPDATE accounts SET balance = ? WHERE id = ?",
                [newBalance, account.id],
                (err) => {
                    if (err)
                        return res.status(500).json({ error: err.message });

                    db.query(
                        "INSERT INTO transactions (account_id, type, amount, description) VALUES (?, ?, ?, ?)",
                        [account.id, "withdraw", amount, "Money withdrawn"],
                        (err, result) => {
                            if (err)
                                return res.status(500).json({ error: err.message });

                            res.status(200).json({
                                message: "Withdrawal successful",
                                balance: newBalance,
                                transactionId: result.insertId
                            });
                        }
                    );
                }
            );
        }
    );
};

const transferMoney = (req, res) => {
    const { receiverAccountNumber, amount } = req.body;

    db.query(
        "SELECT * FROM accounts WHERE user_id = ?",
        [req.user.id],
        (err, senderAccounts) => {
            if (err)
                return res.status(500).json({ error: err.message });

            if (senderAccounts.length === 0)
                return res.status(404).json({ message: "Sender account not found" });

            const sender = senderAccounts[0];

            db.query(
                "SELECT * FROM accounts WHERE account_number = ?",
                [receiverAccountNumber],
                (err, receiverAccounts) => {
                    if (err)
                        return res.status(500).json({ error: err.message });

                    if (receiverAccounts.length === 0)
                        return res.status(404).json({ message: "Receiver account not found" });

                    const receiver = receiverAccounts[0];

                    if (Number(sender.balance) < Number(amount))
                        return res.status(400).json({ message: "Insufficient balance" });

                    const senderBalance = Number(sender.balance) - Number(amount);
                    const receiverBalance = Number(receiver.balance) + Number(amount);

                    db.query(
                        "UPDATE accounts SET balance = ? WHERE id = ?",
                        [senderBalance, sender.id],
                        (err) => {
                            if (err)
                                return res.status(500).json({ error: err.message });

                            db.query(
                                "UPDATE accounts SET balance = ? WHERE id = ?",
                                [receiverBalance, receiver.id],
                                (err) => {
                                    if (err)
                                        return res.status(500).json({ error: err.message });

                                    res.status(200).json({
                                        message: "Transfer successful",
                                        balance: senderBalance
                                    });
                                }
                            );
                        }
                    );
                }
            );
        }
    );
};

const getTransactionHistory = (req, res) => {
    db.query(
        "SELECT * FROM accounts WHERE user_id = ?",
        [req.user.id],
        (err, accounts) => {
            if (err)
                return res.status(500).json({ error: err.message });

            if (accounts.length === 0)
                return res.status(404).json({ message: "Account not found" });

            db.query(
                "SELECT * FROM transactions WHERE account_id = ? ORDER BY created_at DESC",
                [accounts[0].id],
                (err, transactions) => {
                    if (err)
                        return res.status(500).json({ error: err.message });

                    res.status(200).json({
                        message: "Transaction history fetched successfully",
                        data: transactions
                    });
                }
            );
        }
    );
};

module.exports = {
    depositMoney,
    withdrawMoney,
    transferMoney,
    getTransactionHistory
};