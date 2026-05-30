const db = require("../config/db");
const generateAccountNumber = require("../utils/generateAccountNumber");

const createAccount = (req, res) => {

    db.query(
        "SELECT * FROM accounts WHERE user_id = ?",
        [req.user.id],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: "Database Error",
                    error: err.message
                });
            }

            if (result.length > 0) {
                return res.status(409).json({
                    message: "User already has a bank account"
                });
            }

            const accountNumber = generateAccountNumber(Date.now());

            db.query(
                `INSERT INTO accounts
                (user_id, account_number, balance, status)
                VALUES (?, ?, ?, ?)`,
                [
                    req.user.id,
                    accountNumber,
                    0,
                    "active"
                ],
                (err, insertResult) => {

                    if (err) {
                        return res.status(500).json({
                            message: "Database Error",
                            error: err.message
                        });
                    }

                    res.status(201).json({
                        message: "Bank account created successfully",
                        data: {
                            id: insertResult.insertId,
                            userId: req.user.id,
                            accountNumber,
                            balance: 0,
                            status: "active"
                        }
                    });
                }
            );
        }
    );
};

const getMyAccount = (req, res) => {

    db.query(
        "SELECT * FROM accounts WHERE user_id = ?",
        [req.user.id],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: "Database Error",
                    error: err.message
                });
            }

            if (result.length === 0) {
                return res.status(404).json({
                    message: "Account not found"
                });
            }

            res.status(200).json({
                message: "Account fetched successfully",
                data: result[0]
            });
        }
    );
};

const getBalance = (req, res) => {

    db.query(
        "SELECT account_number, balance, status FROM accounts WHERE user_id = ?",
        [req.user.id],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: "Database Error",
                    error: err.message
                });
            }

            if (result.length === 0) {
                return res.status(404).json({
                    message: "Account not found"
                });
            }

            res.status(200).json({
                accountNumber: result[0].account_number,
                balance: result[0].balance,
                status: result[0].status
            });
        }
    );
};

module.exports = {
    createAccount,
    getMyAccount,
    getBalance
};