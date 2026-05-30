const db = require("../config/db");

const getAllUsers = (req, res) => {

    db.query(
        "SELECT id, name, email, role FROM users",
        (err, results) => {

            if (err) {
                return res.status(500).json({
                    message: "Database Error",
                    error: err.message
                });
            }

            res.status(200).json({
                message: "All users fetched successfully",
                data: results
            });
        }
    );
};

const getAllAccounts = (req, res) => {

    db.query(
        "SELECT * FROM accounts",
        (err, results) => {

            if (err) {
                return res.status(500).json({
                    message: "Database Error",
                    error: err.message
                });
            }

            res.status(200).json({
                message: "All accounts fetched successfully",
                data: results
            });
        }
    );
};

const getAllTransactions = (req, res) => {

    db.query(
        "SELECT * FROM transactions",
        (err, results) => {

            if (err) {
                return res.status(500).json({
                    message: "Database Error",
                    error: err.message
                });
            }

            res.status(200).json({
                message: "All transactions fetched successfully",
                data: results
            });
        }
    );
};

const freezeAccount = (req, res) => {

    const accountId = parseInt(req.params.id);

    db.query(
        "UPDATE accounts SET status = ? WHERE id = ?",
        ["inactive", accountId],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: "Database Error",
                    error: err.message
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Account not found"
                });
            }

            res.status(200).json({
                message: "Account frozen successfully"
            });
        }
    );
};

const unfreezeAccount = (req, res) => {

    const accountId = parseInt(req.params.id);

    db.query(
        "UPDATE accounts SET status = ? WHERE id = ?",
        ["active", accountId],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: "Database Error",
                    error: err.message
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Account not found"
                });
            }

            res.status(200).json({
                message: "Account unfrozen successfully"
            });
        }
    );
};

module.exports = {
    getAllUsers,
    getAllAccounts,
    getAllTransactions,
    freezeAccount,
    unfreezeAccount
};